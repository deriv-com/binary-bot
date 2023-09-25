import {
    getLanguage,
    getAppIdFallback,
    getServerAddressFallback,
    getClientAccounts,
    setClientAccounts,
} from '@storage';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { observer as globalObserver } from '@utilities/observer';

const socket_url = `wss://${getServerAddressFallback()}/websockets/v3?app_id=${getAppIdFallback()}&l=${getLanguage().toUpperCase()}&brand=deriv`;

class APIBase {
    api;
    token;
    login_id;
    active_login_id;
    parsed_asset_index;
    account_info = {};
    landing_compnay = {};
    landing_company_details = {};
    account_status = {};
    active_symbols = {};

    constructor() {
        this.init();
        this.initEventListeners();
    }

    init() {
        try {
            this.api = new DerivAPIBasic({
                connection: new WebSocket(socket_url),
            });

            this.api.onOpen().subscribe(() => {
                // eslint-disable-next-line no-console
                console.log('Connection has been established!', this.api);
            });
            this.getActiveSymbols();
        } catch (error) {
            globalObserver.emit('Error', error);
        }
    }

    async authorize(token) {
        if (this.token === token) return { authorize: this.account_info };
        this.token = token;
        await this.api.authorize(token);
        const { authorize, error } = await this.api.expectResponse('authorize');

        this.active_login_id = authorize.loginid;
        this.account_info = authorize;
        this.getLandingCompanyDetails();
        this.getLandingCompany();
        this.getAccountStatus();
        this.getAllBalances();
        if (error) {
            throw new Error(error);
        }
        return { authorize, error };
    }

    async getLandingCompanyDetails() {
        const { landing_company_details = {} } = await this.api.send({
            landing_company_details: this.account_info.landing_company_name,
        });
        const { has_reality_check = false } = landing_company_details;

        const client_accounts = getClientAccounts();
        client_accounts[this.active_login_id].hasRealityCheck = has_reality_check;
        setClientAccounts(client_accounts);

        this.landing_company_details = landing_company_details;
        return {
            landing_company_details,
        };
    }

    async getLandingCompany() {
        const { landing_company } = await this.api.send({
            landing_company: this.account_info.country,
        });

        this.landing_compnay = landing_company;

        return {
            landing_company,
        };
    }

    async getAccountStatus() {
        const { get_account_status } = await this.api.send({
            get_account_status: 1,
        });
        this.account_status = get_account_status;
        return {
            account_status: get_account_status,
        };
    }

    async getAllBalances() {
        const { balance = {} } = await this.api.send({ balance: 1, account: 'all', subscribe: 1 });
        if (balance?.accounts) {
            const { accounts = {} } = balance;

            const client_accounts = getClientAccounts();
            Object.keys(accounts).forEach(key => {
                client_accounts[key].balance = accounts[key]?.balance || 0;
            });
            setClientAccounts(client_accounts);
        }
        return {
            balance,
        };
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('online', this.reconnectIfNotConnected);
            window.addEventListener('focus', this.reconnectIfNotConnected);
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

    async getActiveSymbols() {
        try {
            const { active_symbols } = await this.api.send({ active_symbols: 'brief' });
            this.active_symbols = active_symbols;
        } catch (error) {
            globalObserver.emit('Error', error);
        }
    }
}

export default APIBase;

export const api_base = new APIBase();
