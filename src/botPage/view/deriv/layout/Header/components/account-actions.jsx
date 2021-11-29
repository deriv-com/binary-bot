import React from "react";
import { translate, isMobile } from "../../../../../../common/utils/tools";
import Notifications from "./notifications.jsx";
import AccountDropdown from "./account-dropdown.jsx";
import { currencyNameMap } from "../../../config";
import { generateDerivLink } from "../../../utils";
import AccountsInfoLoader from "./accounts-info-loader.jsx";

const AccountActions = ({ clientInfo }) => {
    const { currency, is_virtual, loginid } = clientInfo.tokenList[0].loginInfo;
    const balance = clientInfo.balance?.accounts[loginid].balance;
    const [isAccDropdownOpen, setIsAccDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef();

    return typeof balance === 'number' ? (
        <React.Fragment>
            <Notifications />
            <a className="url-account-details header__account header__menu-item mobile-hide" href={generateDerivLink('account')}>
                <img className="header__icon-button" id="header__account-settings" src="image/deriv/ic-user-outline.svg" />
            </a>
            <div className="header__divider mobile-hide"></div>
            <div 
                id="acc_switcher"
                className="header__menu-item header__menu-acc"
                onClick={() => setIsAccDropdownOpen(!isAccDropdownOpen)}
            >
                <div className="header__acc-info">
                    <img 
                        id="header__acc-icon" 
                        className="header__acc-icon" 
                        src={`image/deriv/currency/ic-currency-${is_virtual ? "virtual" : currency.toLowerCase()}.svg`} 
                    />
                    <div id="header__acc-balance" className="header__acc-balance">
                        {balance?.toLocaleString(undefined, { minimumFractionDigits: currencyNameMap[currency]?.fractional_digits ?? 2})}
                        <span className="symbols">&nbsp;{currency}</span>
                    </div>
                    <img 
                        className={`header__icon header__expand ${isAccDropdownOpen ? "open" : ""}`}
                        src="image/deriv/ic-chevron-down-bold.svg" 
                    />
                </div>
            </div>
            {isAccDropdownOpen && 
            <AccountDropdown 
                clientInfo={clientInfo}
                ref={dropdownRef}
                setIsAccDropdownOpen = {setIsAccDropdownOpen}
            />}
            <a className="url-cashier-deposit btn btn--primary header__deposit mobile-hide" href="https://app.deriv.com/cashier/deposit">{translate("Deposit")}</a>
        </React.Fragment>
    ) : (
        <AccountsInfoLoader is_mobile={isMobile()}/>
    )
};

export default AccountActions;
