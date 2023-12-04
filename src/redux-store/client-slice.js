import { createSlice, current } from '@reduxjs/toolkit';

const initial_state = {
    account_list: [],
    account_balance: {},
    balance: 0,
    currency: 'USD',
    is_virtual: false,
    login_id: '',
    total_deriv: {},
    total_demo: {},
    is_eu: false,
    is_logged: false,
    is_gd_logged_in: !!localStorage.getItem('access_token'),
    accounts: {},
    account_type: {},
    active_symbols: [],
};

export const clientSlice = createSlice({
    name: 'client',
    initialState: initial_state,
    reducers: {
        setActiveSymbols: (state, action) => {
            state.active_symbols = action.payload;
        },
        updateAccountType: (state, action) => {
            state.account_type = {
                ...state.account_type,
                high_risk: action?.payload?.high_risk,
                high_risk_or_eu: action?.payload?.high_risk_or_eu,
                low_risk: action?.payload?.low_risk,
                low_risk_without_account: action?.payload?.low_risk_without_account,
                high_risk_without_account: action?.payload?.high_risk_without_account,
                is_multiplier: action?.payload?.is_multiplier,
                country_code: action?.payload?.country_code,
            };
        },
        updateIsLogged: (state, action) => {
            state.is_logged = action.payload;
        },
        resetClient: () => initial_state,
        updateActiveAccount: (state, action) => {
            state.account_list = [...action.payload.account_list];
            state.is_virtual = !!action.payload.is_virtual;
            state.currency = action.payload.currency;
            state.balance = action.payload.balance;
        },
        /**
         * @setLoginId sets the login id in the redux store as well in the local storage
         * @param {*} login id
         */
        setLoginId: (state, action) => {
            state.login_id = action.payload;
        },
        setGdLoggedIn: (state, action) => {
            state.is_gd_logged_in = action.payload;
        },
        updateBalance: (state, action) => {
            if (action.payload.loginid === state.login_id) {
                state.balance = action.payload.balance;
                state.currency = action.payload.currency;
            }
            if (action.payload.total?.deriv) {
                state.total_deriv = action.payload.total.deriv;
            }
            if (action.payload.accounts) {
                state.accounts = { ...action.payload.accounts };
                return;
            }
            if (action.payload.loginid in current(state.accounts)) {
                const account = state.accounts[action.payload.loginid];
                account.balance = action.payload.balance;
                state.account_balance = {
                    ...state.account_balance,
                    [action.payload.loginid]: account,
                };
            }
        },
    },
});

export const {
    updateIsLogged,
    resetClient,
    updateActiveAccount,
    updateBalance,
    updateAccountType,
    setGdLoggedIn,
    setLoginId,
    setActiveSymbols,
} = clientSlice.actions;

export default clientSlice.reducer;
