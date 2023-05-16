import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import AppIdMap from '../../../common/appIdResolver';
import { supportedLanguages } from '../../../common/i18n';
import { setCookieLanguage } from '../../../common/utils/cookieManager';
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

// TODO: If network goes of then we should destroy the current api instance
// and once the network is back we need to create a new api instance.
const api = new DerivAPIBasic({
    connection: new WebSocket(socket_url),
});

export default api;

class APIBase {
    api;
    token;
    account_id;
    account_info;
    has_activeSymbols = false;
    active_symbols = [];
    pip_sizes = {};

    async init() {
        this.api = await new DerivAPIBasic({
            connection: new WebSocket(socket_url),
        });
        this.initEventListeners();
        this.authorize();
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('online', this.reconnectIfNotConnected);
            window.addEventListener('focus', this.reconnectIfNotConnected);
        }
    }

    async authorize() {
        this.token = getStorage('activeToken');
        this.account_id = getStorage('active_loginid');

        if (this.token) {
            const { authorize } = await this.api.authorize(this.token);
            this.account_info = authorize;
        }
    }

    getActiveSymbols() {
        doUntilDone(() => this.api.send({ active_symbols: 'brief' })).then(({ active_symbols = [] }) => {
            const pip_sizes = {};
            if (active_symbols.length) this.has_activeSymbols = true;
            this.active_symbols = active_symbols;

            active_symbols.forEach(({ symbol, pip }) => {
                pip_sizes[symbol] = +(+pip).toExponential().substring(3);
            });
            this.pip_sizes = pip_sizes;
        });
    }
}

export const api_base = new APIBase();
