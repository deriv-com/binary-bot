import React from "react";
import { useSelector,useDispatch } from "react-redux";
import { isMobile, isDesktop } from "../../../../../common/utils/tools";
import { platforms } from "../../config.js";
import PlatformDropdown from "./components/platform-dropdown.jsx";
import classNames from "classnames";
import { isLoggedIn } from "../../utils";
import {updateIsLooged} from '../../store/client-slice';
import {DrawerMenu, AuthButtons,AccountActions,MenuLinks } from './components';

const Header = () => {
    const [isPlatformSwitcherOpen, setIsPlatformSwitcherOpen] = React.useState(false);
    const [showDrawerMenu, updateShowDrawerMenu] = React.useState(false);
    const platformDropdownRef = React.useRef();
    const {is_logged} = useSelector(state=>state.client)
    const client = useSelector(state=>state.client)
    const dispatch = useDispatch();
    const hideDropdown = e => !platformDropdownRef.current.contains(e.target) && setIsPlatformSwitcherOpen(false);

    React.useEffect(()=>{
        dispatch(updateIsLooged(isLoggedIn()));
    },[is_logged])

    return (
        <div className="header">
            <div id="deriv__header" className="header__menu-items">
                {isDesktop() &&
                <div className="header__menu-left">
                    {isPlatformSwitcherOpen && <PlatformDropdown platforms={platforms} hideDropdown={hideDropdown} ref={platformDropdownRef}/>}
                    <div 
                        id="platform__switcher" 
                        className="header__menu-item platform__switcher" 
                        onClick={() => setIsPlatformSwitcherOpen(!isPlatformSwitcherOpen)}
                    >
                        <img className="header__logo" src="image/deriv/brand/ic-brand-binarybot.svg" />
                        <div className="platform__switcher-header">Binary Bot</div>
                        <img 
                            id="platform__switcher-expand"
                            className={classNames("header__icon header__expand", {"open" : isPlatformSwitcherOpen})}
                            src="image/deriv/ic-chevron-down-bold.svg"
                        />
                    </div>
                    {is_logged && <MenuLinks />}
                </div>
                }
                {isMobile() && (
                    <img 
                        className="btn__close header__hamburger" 
                        src="image/deriv/ic-hamburger.svg"
                        onClick= {()=>{updateShowDrawerMenu(true)}}
                    />
                )}
                <div className="header__menu-right">
                    {is_logged 
                        ? <AccountActions />
                        : <AuthButtons /> 
                    }
                </div>
            </div>
            {showDrawerMenu && 
                <DrawerMenu
                     updateShowDrawerMenu={updateShowDrawerMenu} 
                     setIsPlatformSwitcherOpen={setIsPlatformSwitcherOpen}
                     isPlatformSwitcherOpen= {isPlatformSwitcherOpen}
                     hideDropdown= {hideDropdown}
                     platformDropdownRef={platformDropdownRef}
                     is_logged={is_logged}
                     />}
        </div>
    );
};

export default Header;
