import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { PropTypes } from 'prop-types';
import config from '@config';
import { translate } from '@i18n';
import * as client_slice from '@redux-store/client-slice.js';
import WalletIcon from './WalletAccountSwitcher/wallet-icon';

const AccountMenu = ({ is_open }) => {
    const dispatch = useDispatch();
    const { currency, is_virtual, balance, login_id, account_list, has_wallet_account } = useSelector(
        state => state.client
    );
    const { is_bot_running } = useSelector(state => state.ui);
    const { currency_name_map } = config;
    const account_icon = is_bot_running ? 'ic-lock' : 'ic-chevron-down-bold';
    const currency_icon = is_virtual ? 'virtual' : currency.toLowerCase() || 'unknown';

    useEffect(() => {
        dispatch(client_slice.setHasWalletAccount(account_list.some(account => account.account_category === 'wallet')));
    }, [account_list]);

    return (
        <div className={classNames('header__acc-info', { disabled: is_bot_running })}>
            <WalletIcon
                currency={currency}
                has_wallet_account={has_wallet_account}
                is_virtual={is_virtual}
                currency_icon={currency_icon}
            />
            <div id='header__acc-balance' className='header__acc-balance'>
                {currency
                    ? balance.toLocaleString(undefined, {
                        minimumFractionDigits: currency_name_map[currency]?.fractional_digits ?? 2,
                    })
                    : ''}
                <span className='symbols'>&nbsp;{currency || translate('No currency assigned')}</span>
                {login_id.includes('MF') && !is_virtual && (
                    <div className='is_symbol_multiplier'>{translate('Multipliers')}</div>
                )}
            </div>
            <img
                className={`header__icon header__expand ${is_open ? 'open' : ''}`}
                src={`/public/images/${account_icon}.svg`}
            />
        </div>
    );
};

AccountMenu.propTypes = {
    is_open: PropTypes.bool,
};

export default AccountMenu;
