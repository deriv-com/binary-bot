import { AppConstants } from "../../../../common/appId";
import {
  getTokenList,
  set as setStorage,
  get as getStorage,
  syncWithDerivApp,
  convertForDerivStore,
} from "StorageManager";

export const isLoggedIn = () => !!getTokenList()?.length;

export const getActiveToken = tokenList => {
  const active_token = getStorage(AppConstants.STORAGE_ACTIVE_TOKEN);
  const activeTokenObject = tokenList.filter(tokenObject => tokenObject.token === active_token);
  return activeTokenObject.length ? activeTokenObject[0] : tokenList[0];
};

export const updateTokenList = () => {
  const token_list = getTokenList();
  if (token_list.length) {
    const active_token = getActiveToken(token_list);
    if ("loginInfo" in active_token) {
      const activeLoginId = token_list[0].accountName;
      setStorage("active_loginid", activeLoginId);
      setStorage("client.accounts", JSON.stringify(convertForDerivStore(token_list)));      
      syncWithDerivApp();
    }
  }
};
