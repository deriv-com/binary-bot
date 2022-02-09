import { AppConstants, logoutAllTokens } from "../../../../common/appId";
import {
  getTokenList,
  set as setStorage,
  get as getStorage,
  syncWithDerivApp,
} from "../../../../common/utils/storageManager";
import { translate } from "../../../../common/i18n";
import { observer as globalObserver } from "../../../../common/utils/observer";

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
      setStorage("client.accounts", JSON.stringify(token_list));
      syncWithDerivApp();
    }
  }
};

export const clearActiveTokens = () => {
  setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, "");
  setStorage("active_loginid", null);
  syncWithDerivApp();
};

export const removeTokens = () => {
  logoutAllTokens().then(() => {
    updateTokenList();
    globalObserver.emit("ui.log.info", translate("Logged you out!"));
    clearActiveTokens();
    window.location.reload();
  });
};
