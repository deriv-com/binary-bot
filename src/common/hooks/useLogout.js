import { useDispatch } from 'react-redux';
import { resetClient } from 'Store/client-slice';
import { updateTokenList } from '../../botPage/view/deriv/utils';
import { AppConstants, logoutAllTokens } from 'Common/appId';
import { set, syncWithDerivApp } from 'StorageManager';

const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    logoutAllTokens().then(() => {
      updateTokenList();
      set(AppConstants.STORAGE_ACTIVE_TOKEN, '');
      set('active_loginid', null);
      syncWithDerivApp();
      dispatch(resetClient());
    })
  }

  return logout
}

export default useLogout;