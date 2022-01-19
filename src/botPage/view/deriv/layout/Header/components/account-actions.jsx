import React from "react";
import { translate } from "../../../../../../common/utils/tools";
import Notifications from "./notifications.jsx";
import AccountDropdown from "./account-dropdown.jsx";
import { currencyNameMap } from "../../../config";
import { generateDerivLink, getActiveToken } from "../../../utils";
import { 
    set as setStorage,
    getTokenList, 
    removeAllTokens, 
    convertForDerivStore,
    syncWithDerivApp

} from "../../../../../../common/utils/storageManager";
import {api} from '../../../../View';
import { useDispatch } from "react-redux";
import {resetClient, updateActiveAccount, updateTokenList, updateBalance} from '../../../store/client-slice';
import { useSelector } from "react-redux";

const AccountActions = () => {
    const { currency, is_virtual, balance, active_token, active_account_name } = useSelector(state=>state.client);
    const [isAccDropdownOpen, setIsAccDropdownOpen] = React.useState(false);
    const dispatch = useDispatch()
    const dropdownRef = React.useRef();

    React.useEffect(()=>{
        api.events.on('balance', response => {
            dispatch(updateBalance(response.balance));
        })
    },[])

    React.useEffect(()=>{
        const token_list = getTokenList();
        const active_token = getActiveToken(token_list);
        if(token_list){
            dispatch(updateTokenList(token_list))
        }
      
        if(active_token?.loginInfo){
            dispatch(updateActiveAccount(active_token))

            api.authorize(active_token.token).then(() => {
                api.send({ forget_all: 'balance' }).then(() => {
                    api.send({
                        balance: 1,
                        account: 'all',
                        subscribe: 1,
                    });
                });
            })
            .catch(()=>{
                removeAllTokens();
                dispatch(resetClient())
            });
        }else{
            const active_login_id = tokenList[0].accountName;
            const client_accounts = convertForDerivStore(active_login_id);
            setStorage('active_loginid', active_login_id);
            setStorage('client.accounts', JSON.stringify(client_accounts));
            syncWithDerivApp();
        }
    },[])

    return (
        <React.Fragment>
            <Notifications />
            {/* [Todo] Needs to remove input after add client info to blockly */}
            <input type="hidden" id="active-token"value={active_token}/>
            <input type="hidden" id="active-account-name"value={active_account_name}/>
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
                        {balance.toLocaleString(undefined, { minimumFractionDigits: currencyNameMap[currency]?.fractional_digits ?? 2})}
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
                virtual = {is_virtual}
                ref={dropdownRef}
                setIsAccDropdownOpen = {setIsAccDropdownOpen}
            />}
            <a className="url-cashier-deposit btn btn--primary header__deposit mobile-hide" href="https://app.deriv.com/cashier/deposit">{translate("Deposit")}</a>
        </React.Fragment>
    )
};

export default AccountActions;
