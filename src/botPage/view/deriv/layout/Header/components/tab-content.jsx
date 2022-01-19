import React from "react";
import { useSelector } from "react-redux";
import { translate } from "../../../../../../common/utils/tools";
import { observer as globalObserver } from '../../../../../../common/utils/observer';
import { currencyNameMap } from "../../../config";
import { generateDerivLink } from "../../../utils";

const TabContent = ({ tab, isActive, setIsAccDropdownOpen}) => {    
    const [isAccordionOpen, setIsAccordionOpen] = React.useState(true);
    const {token_list, account_balance} = useSelector(state=>state.client)
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
                    {token_list.map((acc, index) => {
                        let acc_balance ={};
                        if( acc.accountName in account_balance){
                            acc_balance = account_balance[acc.accountName]
                        }

                        return isReal !== Boolean(acc.loginInfo.is_virtual) && (
                            <div 
                                className={`account__switcher-acc ${index === 0 ? "account__switcher-acc--active" : ""}`}
                                key={acc.accountName} 
                                onClick = {()=> {switchAccount(index)}}
                                ref={el => item_ref.current[index] = el} 
                            >
                                <input type="hidden" className="token"  value={acc.token}/>
                                <img 
                                    src={`image/deriv/currency/ic-currency-${
                                        acc.loginInfo.is_virtual ? "virtual" : acc_balance?.currency?.toLowerCase()
                                    }.svg`} 
                                />
                                <span>
                                    {acc.loginInfo.is_virtual ? translate("Demo") : (currencyNameMap[acc_balance.currency]?.name || acc_balance.currency)}
                                    <div className="account__switcher-loginid">{acc.loginInfo.loginid}</div>
                                </span>
                                <span className="account__switcher-balance">
                                    {acc_balance?.balance?.toLocaleString(undefined, { minimumFractionDigits: currencyNameMap[acc_balance.currency]?.fractional_digits ?? 2})}
                                    <span className="symbols">&nbsp;{acc_balance?.currency ==="UST"?"USDT":acc_balance?.currency}</span>
                                </span>
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
