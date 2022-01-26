
import React from "react";
import { translate } from "../../../../../../common/utils/tools";
import { observer as globalObserver } from '../../../../../../common/utils/observer';
import { currencyNameMap } from "../../../config";
import { generateDerivLink } from "../../../utils";

const TabContent = ({ tab, clientInfo, isActive, setIsAccDropdownOpen}) => {    
    const [isAccordionOpen, setIsAccordionOpen] = React.useState(true);
    const item_ref = React.useRef([])
    const isReal = tab === "real";
    
    function switchAccount(index){
        setIsAccDropdownOpen(false)
        const token = item_ref.current[index].querySelector('.token').value
        globalObserver.emit('ui.switch_account',token)
    }   


    return (
        <div className={`account__switcher-tabs-content ${isActive ? "" : "hide"}`} >
            <div className="account__switcher-accordion">
                <h3 className="ui-accordion-header ui-state-default" onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                    <div className="account__switcher-accordion-header-text">
                        <span>{translate(isReal ? "Deriv Accounts" : "Demo Accounts")}</span>
                        <img className={`header__expand ${isAccordionOpen ? "open" : ""}`} src="image/deriv/ic-chevron-down.svg" />
                    </div>
                </h3>
                <div className={`account__switcher-list ${isAccordionOpen ? "open" : ""}`}>
                    {clientInfo.tokenList.map(({ loginInfo, token, accountName }, index) => {
                        const { loginid, currency, is_virtual } = loginInfo;
                        const accBalanceInfo = clientInfo.balance?.accounts[loginid];
                        const amount = accBalanceInfo?.balance.toLocaleString(undefined, { minimumFractionDigits: currencyNameMap[currency]?.fractional_digits ?? 2})
                        
                        return isReal !== Boolean(is_virtual) && (
                            <div 
                                className={`account__switcher-acc ${index === 0 ? "account__switcher-acc--active" : ""}`}
                                key={accountName} 
                                onClick = {()=> {switchAccount(index)}}
                                ref={el => item_ref.current[index] = el} 
                            >
                                <input type="hidden" className="token"  value={token}/>
                                
                                <img 
                                    src={`image/deriv/currency/ic-currency-${is_virtual ? "virtual" : currency?.toLowerCase() || "unknown"}.svg`}
                                />
                                
                                    
                                {currency ? <>
                                <span>
                                        {is_virtual ? translate("Demo") : (currencyNameMap[currency]?.name || currency)}
                                        <div className="account__switcher-loginid">{loginid}</div>
                                    </span>
                                    <span className={currency ?  "account__switcher-balance" : "acc-info__balance acc-info__balance--no-currency-text" }>
                                        {currency ? amount : translate('No currency assigned')}
                                        <span className="symbols">&nbsp;{currency}</span>
                                    </span>
                                    </> : 
                                    <span>
                                    <span className={currency ?  "account__switcher-balance" : "acc-info__balance acc-info__balance--no-currency-text" }>
                                        {currency ? amount : translate('No currency assigned')}
                                        <span className="symbols">&nbsp;{currency}</span>
                                    </span>
                                    <span>
                                        {is_virtual ? translate("Demo") : (currencyNameMap[currency]?.name || currency)}
                                        <div className="account__switcher-loginid">{loginid}</div>
                                    </span>
                                    </span>}
                                 
                               
                            </div>
                        )}
                    )}
                    {isReal && (
                        <a href={generateDerivLink("redirect","action=add_account")} rel="noopener noreferrer" className="account__switcher-add">
                            <img className="account__switcher-add-icon" src="image/deriv/ic-add-circle.svg" />
                            <span className="account__switcher-add-text">{translate("Add Deriv account")}</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TabContent;

