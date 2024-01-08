import React from 'react';
import PropTypes from 'prop-types';
import './wallet-icon.scss';

const WalletIcon = ({ currency, is_virtual, currency_icon }) => {
    const wallet_icon_path = '/public/images/wallet/';
    const default_currency_icon_path = `/public/images/currency/ic-currency-${currency_icon}.svg`;
    const isWalletIcon = _currency => {
        const wallet_icons = ['btc', 'eth', 'ltc', 'usdc', 'eusdt', 'tusdt'];
        return wallet_icons.includes(_currency.toLowerCase());
    };

    const src_path =
        isWalletIcon(currency) && !is_virtual
            ? `${wallet_icon_path}${currency_icon}.svg`
            : is_virtual
                ? `${wallet_icon_path}ic-wallet-deriv-demo-light.svg`
                : default_currency_icon_path;

    return (
        <div className='acc-info__wallets-container'>
            {
                <div className='app-icon__top-icon'>
                    <div className='wallet-icon'>
                        <img src={`${wallet_icon_path}ic-wallet-options-light.svg`} alt='wallet_icon' />
                    </div>
                </div>
            }
            <div className={'app-icon__bottom-icon'}>
                <div
                    className={`wallet-icon wallet-icon--small wallet-icon__default-bg wallet-card__${
                        is_virtual ? 'demo' : currency.toLowerCase()
                    }-bg`}
                >
                    <img src={src_path} alt='wallet_icon' />
                </div>
            </div>
        </div>
    );
};

WalletIcon.propTypes = {
    currency: PropTypes.string,
    is_virtual: PropTypes.bool,
    currency_icon: PropTypes.string,
};

export default WalletIcon;
