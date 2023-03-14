import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import AppIdMap from '../../../common/appIdResolver';
import { supportedLanguages } from '../../../common/i18n';
import { setCookieLanguage } from '../../../common/utils/cookieManager';
import { observer as globalObserver } from '../../../common/utils/observer';
import { doUntilDone } from '../../bot/tools';

// [Todo] getLanguage, getStorage, setStorage are duplicated here after update the structure of project we should remove them

function getStorage(label) {
    return window.localStorage.getItem(label);
}

function setStorage(label, data) {
    window.localStorage.setItem(label, data);
}

export const parseQueryString = () => {
    if (typeof window === 'undefined') {
        return {};
    }
    const str = window.location.search;
    const objURL = {};
    str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), (a0, a1, a2, a3) => {
        objURL[a1] = a3;
    });
    return objURL;
};

export const getLanguage = () => {
    const queryLang = parseQueryString().l || getStorage('lang');
    const lang = queryLang in supportedLanguages ? queryLang : 'en';
    setStorage('lang', lang);
    setCookieLanguage(lang);
    return lang;
};

const isRealAccount = () => {
    const accountList = JSON.parse(getStorage('tokenList') || '{}');
    const activeToken = getStorage('activeToken') || [];
    let activeAccount = null;
    let isReal = false;
    try {
        activeAccount = accountList.filter(account => account.token === activeToken);
        isReal = !activeAccount[0].accountName.startsWith('VRT');
    } catch (e) {} // eslint-disable-line no-empty
    return isReal;
};

const hostName = document.location.hostname;

const getDomainAppId = () => {
    const hostname = hostName.replace(/^www./, '');

    // eslint-disable-next-line no-nested-ternary
    return hostname in AppIdMap.production
        ? AppIdMap.production[hostname]
        : // eslint-disable-next-line no-nested-ternary
        hostname in AppIdMap.staging
        ? AppIdMap.staging[hostname]
        : hostname in AppIdMap.dev
        ? AppIdMap.dev[hostname]
        : 29864;
};

export const getCustomEndpoint = () => ({
    url: getStorage('config.server_url'),
    appId: getStorage('config.app_id'),
});

export const getDefaultEndpoint = () => ({
    url: isRealAccount() ? 'green.binaryws.com' : 'blue.binaryws.com',
    appId: getStorage('config.default_app_id') || getDomainAppId(),
});

export const getServerAddressFallback = () => getCustomEndpoint().url || getDefaultEndpoint().url;
export const getWebSocketURL = () => `wss://${getServerAddressFallback()}`;

export const getAppIdFallback = () => getCustomEndpoint().appId || getDefaultEndpoint().appId;

const socket_url = `wss://${getServerAddressFallback()}/websockets/v3?app_id=${getAppIdFallback()}&l=${getLanguage().toUpperCase()}&brand=deriv`;

const getToken = () => ({
    token: getStorage('activeToken'),
    account_id: getStorage('active_loginid'),
})

class APIBase {
    api;
    token;
    account_id;
    pip_sizes = {};
    account_info = {};
    is_running = false;
    subscriptions = [];
    time_interval = null;
    has_activeSymbols = false;
    constructor() {
        this.init();
    }

    init(force_update = false) {
        if (getStorage('activeToken')) {
            this.toggleRunButton(true);
            if (force_update) this.terminate();
            this.api = new DerivAPIBasic({
                connection: new WebSocket(socket_url),
            });
            this.initEventListeners();
            this.authorizeAndSubscribe();
            if (this.time_interval) clearInterval(this.time_interval);
            this.time_interval = null;
            this.getTime();
        }
    }

    terminate() {
        // eslint-disable-next-line no-console
        console.log('connection terminated');
        if (this.api) this.api.disconnect();
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('online', this.reconnectIfNotConnected);
            window.addEventListener('focus', this.reconnectIfNotConnected);
        }
    }

    createNewInstance(account_id) {
        if (this.account_id !== account_id) {
            this.init(true);
        }
    }

    reconnectIfNotConnected = () => {
        // eslint-disable-next-line no-console
        console.log('connection state: ', this.api.connection.readyState);
        if (this.api.connection.readyState !== 1) {
            // eslint-disable-next-line no-console
            console.log('Info: Connection to the server was closed, trying to reconnect.');
            this.init();
        }
    };

    authorizeAndSubscribe() {
        const { token, account_id } = getToken();
        if (token) {
            this.token = token;
            this.account_id = account_id;
            this.api
                .authorize(this.token)
                .then(({ authorize }) => {
                    if (this.has_activeSymbols) {
                        this.toggleRunButton(false);
                    } else {
                        this.getActiveSymbols();
                    }
                    this.subscribe();
                    this.account_info = authorize;
                })
                .catch(e => {
                    globalObserver.emit('Error', e);
                });
        }
    }

    subscribe() {
        doUntilDone(() => this.api.send({ balance: 1, subscribe: 1, account: 'all' }));
        doUntilDone(() => this.api.send({ proposal_open_contract: 1, subscribe: 1 }));
    }

    getActiveSymbols = async () => {
        doUntilDone(() => this.api.send({ active_symbols: 'brief' })).then(({ active_symbols = [] }) => {
            const pip_sizes = {};
            if (active_symbols.length) this.has_activeSymbols = true;
            active_symbols.forEach(({ symbol, pip }) => {
                pip_sizes[symbol] = +(+pip).toExponential().substring(3);
            });
            this.pip_sizes = pip_sizes;
            this.toggleRunButton(false);
        });
    };

    toggleRunButton = toggle => {
        const run_button = document.querySelector('#db-animation__run-button');
        if (!run_button) return;
        run_button.disabled = toggle;
    };

    setIsRunning(toggle = false) {
        this.is_running = toggle;
    }

    pushSubscription(subscription) {
        this.subscriptions.push(subscription);
    }

    clearSubscriptions() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];

        // Resetting timeout resolvers
        const global_timeouts = globalObserver.getState('global_timeouts') ?? [];

        global_timeouts.forEach((_, i) => {
            clearTimeout(i);
        });
    }

    getTime() {
        if (!this.time_interval) {
            this.time_interval = setInterval(() => {
                this.api.send({ time: 1 });
            }, 30000);
        }
    }
}

const api_base = new APIBase();

export default api_base;