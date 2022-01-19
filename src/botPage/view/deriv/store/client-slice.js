import { createSlice, current } from '@reduxjs/toolkit';

const initial_state = {
  active_token: '',
  account_list: [],
  active_account_name: '',
  account_balance: {},
  token_list: [],
  balance: 0,
  currency: 'USD',
  is_virtual: false,
  login_id: '',
  total_deriv: {},
  total_demo: {},
  is_eu: false,
  is_logged: false,
};

export const clientSlice = createSlice({
  name: 'client',
  initialState: initial_state,
  reducers: {
    updateIsLooged: (state, action) => {
      state.is_logged = action.payload;
    },
    resetClient: () => initial_state,
    updateActiveAccount: (state, action) => {
      state.active_account_name = action.payload.accountName;
      state.active_token = action.payload.token;
      state.account_list = [...action.payload.loginInfo.account_list];
      state.is_virtual = !!action.payload.loginInfo.is_virtual;
      state.balance = action.payload.loginInfo.balance;
    },
    updateTokenList: (state, action) => {
      state.token_list = action.payload;
    },
    updateBalance: (state, action) => {
      if (action.payload.loginid === state.active_account_name) {
        state.balance = action.payload.balance;
        state.currency = action.payload.currency;
      }
      if (action.payload.total?.deriv) {
        state.total_deriv = action.payload.total.deriv;
      }
      if (action.payload.accounts) {
        state.account_balance = { ...action.payload.accounts };
        return;
      }
      if (action.payload.loginid in current(state.account_balance)) {
        const account = state.account_balance[action.payload.loginid];
        account.balance = action.payload.balance;
        state.account_balance = {
          ...state.account_balance,
          [action.payload.loginid]: account,
        };
      }
    },
  },
});

export const { updateIsLooged, resetClient, updateActiveAccount, updateTokenList, updateBalance } = clientSlice.actions;

export default clientSlice.reducer;
