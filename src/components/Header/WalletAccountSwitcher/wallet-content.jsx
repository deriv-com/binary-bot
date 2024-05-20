import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { api_base } from '@api-base';
import classNames from 'classnames';
import config from '@config';
import { getActiveLoginId } from '@storage';
import { translate } from '@i18n';
import { setAccountSwitcherId } from '@redux-store/ui-slice';
import WalletIcon from './wallet-icon';
import './wallet-icon.scss';

const WalletContent = ({ setIsAccDropdownOpen, accounts }) => {
    const dispatch = useDispatch();
    const { login_id } = useSelector(state => state.client);

    const active_account = { ...api_base.account_info };
    const { landing_company_name } = active_account;

    const onChangeAccount = id => {
        const active_login_id = getActiveLoginId();
        if (id && active_login_id && id !== active_login_id) {
            dispatch(setAccountSwitcherId(id));
            setIsAccDropdownOpen(false);
        }
    };

    return (
        <div className={'account__switcher-tabs-content account__wallet-switcher-tabs-content'}>
            <div className={'account__wallet-switcher-list open'}>
                {accounts.map(account => {
                    const { demo_account, currency, balance } = account;
                    const currency_icon = demo_account ? 'virtual' : currency?.toLowerCase() || 'unknown';
                    const getBalance = () =>
                        balance.toLocaleString(undefined, {
                            minimumFractionDigits: config.currency_name_map[currency]?.fractional_digits ?? 2,
                        });

                    return (
                        <div
                            className={classNames('account__switcher-wallet-acc', {
                                'account__switcher-acc--active': login_id === account.account,
                            })}
                            key={account.account}
                            onClick={e => {
                                e.stopPropagation();
                                onChangeAccount(account.account);
                            }}
                            role='button'
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.stopPropagation();
                                    onChangeAccount(account.account);
                                }
                            }}
                        >
                            <input type='hidden' name='account_name' value={account.account} />
                            <div>
                                <div className='app-icon'>
                                    <WalletIcon
                                        currency={currency}
                                        is_virtual={!!demo_account}
                                        currency_icon={currency_icon}
                                    />
                                </div>
                            </div>
                            <div className='wallet-content'>
                                {!currency && <span className='symbols'>{translate('No currency assigned')}</span>}
                                <span>{translate('Deriv Apps')}</span>
                                <div className='account__switcher-loginid'>{`${currency} ${translate('Wallet')}`}</div>
                                <span className='account__switcher-balance'>
                                    {currency && getBalance()}
                                    <span className='symbols'>
                                        &nbsp;
                                        {currency && currency === 'UST' ? 'USDT' : account?.currency}
                                    </span>
                                </span>
                            </div>
                            {!!demo_account && (
                                <span
                                    className={classNames('dc-badge', {
                                        'dc-badge--blue': !!demo_account,
                                        'dc-badge--bordered': !demo_account,
                                    })}
                                >
                                    {translate('Demo')}
                                </span>
                            )}
                            {landing_company_name === 'maltainvest' && <span>malta</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

WalletContent.propTypes = {
    accounts: PropTypes.array,
    setIsAccDropdownOpen: PropTypes.func,
};

export default WalletContent;
