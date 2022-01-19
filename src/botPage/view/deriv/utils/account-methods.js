import { getTokenList, get as getStorage } from '../../../../common/utils/storageManager';
import { AppConstants } from '../../../../common/appId';

export const isLoggedIn = () => !!getTokenList()?.length;

export const getActiveToken = tokenList => {
  const active_token = getStorage(AppConstants.STORAGE_ACTIVE_TOKEN);
  const activeTokenObject = tokenList.filter(tokenObject => tokenObject.token === active_token);
  return activeTokenObject.length ? activeTokenObject[0] : tokenList[0];
};
