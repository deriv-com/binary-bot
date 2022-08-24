import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../../common/utils/tools';
import { generateDerivLink } from '../../../utils';
import { getTokenList } from '../../../../../../common/utils/storageManager';
import { useDispatch } from 'react-redux';
import { setAccountSwitcherToken } from '../../../store/ui-slice';
import classNames from 'classnames';
import { observer as globalObserver } from '../../../../../../common/utils/observer';
import config from '../../../../../../app.config';

const TabContent = ({ tab, isActive, setIsAccDropdownOpen }) => {
    const [isAccordionOpen, setIsAccordionOpen] = React.useState(true);
    const dispatch = useDispatch();
    const { accounts, active_account_name } = useSelector(state => state.client);
    const { show_bot_unavailable_page } = useSelector(state => state.ui);
    const item_ref = React.useRef([]);
    const isReal = tab === 'real';
    const token_list = getTokenList();

    const onChangeAccount = acc => {
        const account_token = token_list.find(token => token.accountName === acc);
        if (account_token?.token && acc !== active_account_name) {
            if (show_bot_unavailable_page) {
                globalObserver.emit('ui.switch_account', account_token.token);
            } else {
                dispatch(setAccountSwitcherToken(account_token?.token));
            }
            setIsAccDropdownOpen(false);
        }
    };

    return (
        <div className={`account__switcher-tabs-content ${isActive ? '' : 'hide'}`}>
            <div className='account__switcher-accordion'>
                <h3
                    className='ui-accordion-header ui-state-default'
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                >
                    <div className='account__switcher-accordion-header-text'>
                        <span>{translate(isReal ? 'Deriv Accounts' : 'Demo Accounts')}</span>
                        <img
                            className={`header__expand ${isAccordionOpen ? 'open' : ''}`}
                            src='image/deriv/ic-chevron-down.svg'
                        />
                    </div>
                </h3>
                <div className={`account__switcher-list ${isAccordionOpen ? 'open' : ''}`}>
                    {accounts &&
                        Object.keys(accounts)
                            .sort((acc, acc1) => {
                                return acc === active_account_name ? -1 : acc1 === active_account_name ? 1 : 0;
                            })
                            .map((acc, index) => {
                                const account = accounts[acc];
                                return (
                                    isReal !== Boolean(account.demo_account) && (
                                        <div
                                            className={classNames('account__switcher-acc', {
                                                'account__switcher-acc--active': index === 0,
                                            })}
                                            key={acc}
                                            onClick={e => {
                                                e.stopPropagation();
                                                onChangeAccount(acc);
                                            }}
                                            ref={el => (item_ref.current[index] = el)}
                                        >
                                            <input type='hidden' name='account_name' value={acc} />
                                            <img
                                                src={`image/deriv/currency/ic-currency-${
                                                    accounts[acc].demo_account
                                                        ? 'virtual'
                                                        : account.currency?.toLowerCase()
                                                }.svg`}
                                            />
                                            <span>
                                                {accounts[acc].demo_account
                                                    ? translate('Demo')
                                                    : config.currency_name_map[account.currency]?.name ||
                                                      account.currency}
                                                <div className='account__switcher-loginid'>{acc}</div>
                                            </span>
                                            <span className='account__switcher-balance'>
                                                {account?.balance?.toLocaleString(undefined, {
                                                    minimumFractionDigits:
                                                        config.currency_name_map[account.currency]?.fractional_digits ??
                                                        2,
                                                })}
                                                <span className='symbols'>
                                                    &nbsp;
                                                    {account?.currency === 'UST' ? 'USDT' : account?.currency}
                                                </span>
                                            </span>
                                        </div>
                                    )
                                );
                            })}
                    {isReal && config.add_account.visible && (
                        <a href={config.add_account.url} rel='noopener noreferrer' className='account__switcher-add'>
                            <img className='account__switcher-add-icon' src='image/deriv/ic-add-circle.svg' />
                            <span className='account__switcher-add-text'>{config.add_account.label}</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TabContent;
