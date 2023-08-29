import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import config from '@config';
import { AppConstants } from '@constants';
import { generateDerivLink } from '@utils';
import { getTokenList, set as setStorage, isLoggedIn } from '@storage';
import { translate } from '@i18n';
import Notifications from './notifications.jsx';
import AccountDropdown from './account-dropdown.jsx';
import Modal from '../../../components/modal';
import AccountSwitchModal from './account-switch-modal.jsx';
import { observer as globalObserver } from '../../../../../../common/utils/observer';
import {
    setAccountSwitcherLoader,
    setAccountSwitcherToken,
    setIsHeaderLoaded,
    setShouldReloadWorkspace,
} from '../../../store/ui-slice';
import Tour, { TourTargets } from '../../../components/tour';
import { addTokenIfValid } from '../../../../../../common/appId';
import { updateActiveToken } from '../../../store/client-slice';
import Popover from '../../../components/popover';

const AccountActions = () => {
    const { currency, is_virtual, balance, active_token, active_account_name } = useSelector(state => state.client);
    const { currency_name_map, deposit } = config;
    const { visible, label, url } = deposit;
    const { account_switcher_token, is_bot_running } = useSelector(state => state.ui);
    const { account_type } = useSelector(state => state.client);
    const [is_acc_dropdown_open, setIsAccDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef();
    const dispatch = useDispatch();
    const is_logged_in = isLoggedIn();

    useEffect(() => {
        dispatch(setIsHeaderLoaded(true));
    }, []);

    useEffect(() => {
        if (account_type) renderAccountMenu();
    }, [account_type, is_logged_in]);

    const onAccept = () => {
        dispatch(setAccountSwitcherToken(''));
        globalObserver.emit('ui.switch_account', account_switcher_token);
        dispatch(setAccountSwitcherLoader(true));
        $('.barspinner').show();
        const tokenList = getTokenList();
        setStorage('tokenList', '');

        addTokenIfValid(account_switcher_token, tokenList).then(() => {
            setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, account_switcher_token);
            const next_active_account = tokenList?.find(account => account.token === account_switcher_token);

            if (next_active_account?.accountName) {
                setStorage('active_loginid', next_active_account.accountName);
                dispatch(updateActiveToken(next_active_account.token));
                dispatch(setShouldReloadWorkspace(true));
                $('.barspinner').hide();
            }
        });
    };

    const onClose = () => {
        dispatch(setAccountSwitcherToken(''));
    };

    const renderAccountMenu = () => {
        const account_icon = is_bot_running ? 'ic-lock' : 'ic-chevron-down-bold';
        const currency_icon = is_virtual ? 'virtual' : currency.toLowerCase() || 'unknown';

        return (
            <div className={classNames('header__acc-info', { disabled: is_bot_running })}>
                <img
                    id='header__acc-icon'
                    className='header__acc-icon'
                    src={`/public/images/currency/ic-currency-${currency_icon}.svg`}
                />
                <div id='header__acc-balance' className='header__acc-balance'>
                    {currency
                        ? balance.toLocaleString(undefined, {
                            minimumFractionDigits: currency_name_map[currency]?.fractional_digits ?? 2,
                        })
                        : ''}
                    <span className='symbols'>&nbsp;{currency || translate('No currency assigned')}</span>
                    {active_account_name.includes('MF') && !is_virtual && (
                        <div className='is_symbol_multiplier'>{translate('Multipliers')}</div>
                    )}
                </div>
                <img
                    className={`header__icon header__expand ${is_acc_dropdown_open ? 'open' : ''}`}
                    src={`/public/images/${account_icon}.svg`}
                />
            </div>
        );
    };

    return (
        <React.Fragment>
            <Notifications />
            {/* [Todo] Needs to remove input after add client info to blockly */}
            <input type='hidden' id='active-token' value={active_token} />
            <input type='hidden' id='active-account-name' value={active_account_name} />
            <a
                className='url-account-details header__account header__menu-item mobile-hide'
                href={generateDerivLink('account')}
            >
                <img
                    className='header__icon-button'
                    id='header__account-settings'
                    src='/public/images/ic-user-outline.svg'
                />
            </a>
            <div className='header__divider mobile-hide'></div>
            <div
                id='acc_switcher'
                className={classNames('header__menu-item header__menu-acc', { disabled: is_bot_running })}
                onClick={() => !is_bot_running && setIsAccDropdownOpen(!is_acc_dropdown_open)}
            >
                {is_bot_running ? (
                    <Popover
                        content={translate(
                            'Account switching is disabled while your bot is running. Please stop your bot before switching accounts.'
                        )}
                        position='bottom'
                    >
                        {renderAccountMenu()}
                    </Popover>
                ) : (
                    renderAccountMenu()
                )}
            </div>

            {is_acc_dropdown_open && (
                <AccountDropdown virtual={is_virtual} ref={dropdownRef} setIsAccDropdownOpen={setIsAccDropdownOpen} />
            )}

            {visible && (
                <a className='url-cashier-deposit btn btn--primary header__deposit mobile-hide' href={url}>
                    {translate(label)}
                </a>
            )}
            {account_switcher_token && (
                <Modal title={translate('Are you sure?')} class_name='account-switcher' onClose={onClose}>
                    <AccountSwitchModal is_bot_running={is_bot_running} onClose={onClose} onAccept={onAccept} />
                </Modal>
            )}
            <TourTargets />
            <Tour />
        </React.Fragment>
    );
};

export default AccountActions;
