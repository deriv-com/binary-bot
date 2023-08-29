import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import config from '@config';
import { parseQueryString, queryToObjectArray, isMobile, isDesktop } from '@utils';
import {
    getTokenList,
    removeAllTokens,
    syncWithDerivApp,
    set as setStorage,
    get as getStorage,
    updateTokenList,
    getActiveToken,
    isLoggedIn,
} from '@storage';
import PlatformDropdown from './components/platform-dropdown.jsx';
import {
    updateIsLogged,
    resetClient,
    updateActiveAccount,
    updateBalance,
    updateActiveToken,
    updateAccountType,
} from '../../store/client-slice';
import { setAccountSwitcherLoader, updateShowMessagePage } from '../../store/ui-slice';
import { DrawerMenu, AuthButtons, AccountActions, MenuLinks, AccountSwitcherLoader } from './components';
import api from '../../api';
import { observer as globalObserver } from '../../../../../common/utils/observer';
import { checkSwitcherType, isEuByAccount } from '../../../../../common/footer-checks';
import './header.scss';

// [Todo] We will update this during the API improvement process
let is_subscribed = false;
const AccountSwitcher = () => {
    const { account_switcher_loader } = useSelector(state => state.ui);
    const { is_logged } = useSelector(state => state.client);
    const query_string = parseQueryString();
    const query_string_array = queryToObjectArray(query_string);

    // [Todo] We should remove this after update the structure of get token list on login
    if (query_string_array[0]?.token) {
        return (
            <div className='header__menu-right-loader'>
                <AccountSwitcherLoader />
            </div>
        );
    }
    if (account_switcher_loader) {
        return (
            <div className='header__menu-right-loader'>
                <AccountSwitcherLoader />
            </div>
        );
    }

    if (is_logged) return <AccountActions />;

    return <AuthButtons />;
};

const Header = () => {
    const [isPlatformSwitcherOpen, setIsPlatformSwitcherOpen] = React.useState(false);
    const [showDrawerMenu, updateShowDrawerMenu] = React.useState(false);
    const platformDropdownRef = React.useRef();
    const { is_logged, active_token } = useSelector(state => state.client);
    const { is_bot_running } = useSelector(state => state.ui);
    const is_logged_in = isLoggedIn();
    const dispatch = useDispatch();
    const hideDropdown = e => !platformDropdownRef?.current?.contains(e.target) && setIsPlatformSwitcherOpen(false);

    React.useEffect(() => {
        const mountSwitcher = async () => {
            try {
                const res = await checkSwitcherType();
                dispatch(updateAccountType(res));
                const current_login_id = localStorage.getItem('active_loginid');
                if (current_login_id.startsWith('MF')) {
                    dispatch(updateShowMessagePage(true));
                }
                return res;
            } catch (error) {
                globalObserver.emit('Error', error);
                return error;
            }
        };
        if (is_logged_in) {
            mountSwitcher();
        }
    }, [is_logged_in]);

    React.useEffect(() => {
        api.onMessage().subscribe(({ data }) => {
            if (data?.error?.code) return;
            if (data?.msg_type === 'balance') {
                dispatch(updateBalance(data.balance));
            }
        });
    }, []);

    React.useEffect(() => {
        const token_list = getTokenList();
        const active_storage_token = getActiveToken(token_list);
        const landing_company = active_storage_token?.loginInfo.landing_company_name;
        dispatch(updateShowMessagePage(landing_company === 'maltainvest'));

        globalObserver.setState({
            is_eu_country: isEuByAccount(token_list),
        });

        if (!active_storage_token) {
            removeAllTokens();
            dispatch(resetClient());
            dispatch(setAccountSwitcherLoader(false));
        }
        const client_accounts = JSON.parse(getStorage('client.accounts'));
        const current_login_id = getStorage('active_loginid') || '';
        const logged_in_token = client_accounts[current_login_id]?.token || active_storage_token?.token || '';

        if (logged_in_token) {
            api.authorize(logged_in_token)
                .then(account => {
                    const active_loginid = account.authorize.account_list;
                    const client_country = account.authorize.country;
                    setStorage('client.country', client_country);
                    active_loginid.forEach(acc => {
                        if (current_login_id === acc.loginid) {
                            setStorage('active_loginid', current_login_id);
                        } else {
                            setStorage('active_loginid', account.authorize.loginid);
                        }
                        updateTokenList();
                    });
                    if (account?.error?.code) return;
                    dispatch(updateActiveToken(logged_in_token));
                    dispatch(updateActiveAccount(account.authorize));
                    dispatch(setAccountSwitcherLoader(false));
                    if (!is_subscribed) {
                        is_subscribed = true;
                        api.send({
                            balance: 1,
                            account: 'all',
                            subscribe: 1,
                        })
                            .then(({ balance }) => {
                                globalObserver.setState({
                                    balance: Number(balance.balance),
                                    currency: balance.currency,
                                });
                            })
                            .catch(e => {
                                globalObserver.emit('Error', e);
                            });
                    }
                })
                .catch(() => {
                    removeAllTokens();
                    dispatch(resetClient());
                    dispatch(setAccountSwitcherLoader(true));
                });
            syncWithDerivApp();
        }
    }, [active_token]);

    React.useEffect(() => {
        dispatch(updateIsLogged(isLoggedIn()));
    }, [is_logged]);

    React.useEffect(() => {
        window.addEventListener('beforeunload', onBeforeUnload, { capture: true });
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload, { capture: true });
        };
    }, [is_bot_running]);

    const onBeforeUnload = e => {
        if (is_bot_running) {
            e.preventDefault();
            e.returnValue = true;
        }
    };

    return (
        <div className='header'>
            <div id='deriv__header' className='header__menu-items'>
                {isDesktop() && (
                    <div className='header__menu-left'>
                        {isPlatformSwitcherOpen && (
                            <PlatformDropdown
                                hideDropdown={hideDropdown}
                                ref={platformDropdownRef}
                                setIsPlatformSwitcherOpen={setIsPlatformSwitcherOpen}
                            />
                        )}
                        <div
                            id='platform__switcher'
                            className='header__menu-item platform__switcher'
                            onClick={() => setIsPlatformSwitcherOpen(!isPlatformSwitcherOpen)}
                        >
                            <img className='header__logo' src={config.app_logo} />
                            <img
                                id='platform__switcher-expand'
                                className={classNames('header__icon header__expand', {
                                    open: isPlatformSwitcherOpen,
                                })}
                                src='/public/images/ic-chevron-down-bold.svg'
                            />
                        </div>
                        {is_logged && <MenuLinks />}
                    </div>
                )}
                {isMobile() && (
                    <img
                        className='btn__close header__hamburger'
                        src='/public/images/ic-hamburger.svg'
                        onClick={() => {
                            updateShowDrawerMenu(true);
                        }}
                    />
                )}
                <div className='header__menu-right'>
                    <AccountSwitcher />
                </div>
            </div>
            {showDrawerMenu && (
                <DrawerMenu
                    updateShowDrawerMenu={updateShowDrawerMenu}
                    setIsPlatformSwitcherOpen={setIsPlatformSwitcherOpen}
                    isPlatformSwitcherOpen={isPlatformSwitcherOpen}
                    hideDropdown={hideDropdown}
                    platformDropdownRef={platformDropdownRef}
                    is_logged={is_logged}
                />
            )}
        </div>
    );
};

export default Header;
