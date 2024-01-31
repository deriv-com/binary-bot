import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import config from '@config';
import { translate } from '@i18n';
import WalletContent from './wallet-content.jsx';
import Text from '../../common/text/text.jsx';
import './account-wallet-dropdown.scss';

const AccountWalletDropdown = React.forwardRef(({ setIsAccDropdownOpen }, dropdownRef) => {
    const { accounts, account_list } = useSelector(state => state.client);
    const container_ref = React.useRef();
    let all_accounts = [];

    const transformAccounts = () =>
        Object.keys(accounts).forEach(account => {
            all_accounts.push({ ...accounts[account], account });
        });

    // Sort wallet accounts alphabetically by fiat, crypto, then virtual.
    const sortWalletAccounts = wallets => {
        const accountOrder = { fiat: 1, crypto: 2, virtual: 3 };
        transformAccounts();

        return wallets
            .filter(
                account => account_list.find(acc => acc.loginid === account.account)?.account_category === 'trading'
            )
            .sort((a, b) => {
                const typeA = account_list.find(acc => acc.loginid === a.account)?.account_type;
                const typeB = account_list.find(acc => acc.loginid === b.account)?.account_type;

                return accountOrder[typeA] - accountOrder[typeB];
            });
    };
    all_accounts = [...sortWalletAccounts(all_accounts)];

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (container_ref.current && !container_ref?.current?.contains(event.target)) {
                setIsAccDropdownOpen(false);
            }
        }
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className='account__switcher-dropdown-wrapper show' ref={dropdownRef}>
            <div id='account__switcher-dropdown' className='account__switcher-dropdown' ref={container_ref}>
                <div className='account__switcher-container'>
                    <div className='account-switcher-wallet__header'>
                        <Text as='h4' weight='bold' size='s'>
                            {translate('Deriv Apps accounts')}
                        </Text>
                    </div>
                    {/* should show real and demo accounts */}
                    <WalletContent setIsAccDropdownOpen={setIsAccDropdownOpen} accounts={all_accounts} />
                </div>
                <div className='account__switcher-total-wallet'>
                    <span>{translate('Looking for CFDs? Go to Trader\'s hub')}</span>

                    <a href={config.tradershub.url} className={'account__switcher-total--link'}>
                        <img
                            className={'header__expand'}
                            src='/public/images/ic-chevron-down-bold.svg'
                            alt='wallet_icon'
                        />
                    </a>
                </div>
            </div>
        </div>
    );
});

AccountWalletDropdown.displayName = 'AccountWalletDropdown';

AccountWalletDropdown.propTypes = {
    setIsAccDropdownOpen: PropTypes.func,
};

export default AccountWalletDropdown;
