import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CONFIG from '@config';
import { getLang } from '@storage';
import { getRelatedDerivOrigin } from '@utils';
import { useLocation } from 'react-router-dom';
import { translate } from '@i18n';

// eslint-disable-next-line react/display-name
const PlatformDropdown = React.forwardRef(({ hideDropdown, setIsPlatformSwitcherOpen }, platformDropdownRef) => {
    const location = useLocation();

    React.useEffect(() => {
        window.addEventListener('click', hideDropdown);
        return () => window.removeEventListener('click', hideDropdown);
    });

    const handleClick = (e, is_binary_bot) => {
        if (e && is_binary_bot) {
            setIsPlatformSwitcherOpen(false);
            e.preventDefault();
        }
    };

    const lang = getLang()?.toLowerCase();

    return (
        <div id='platform__dropdown' className='platform__dropdown show'>
            <div id='platform__list' className='platform__dropdown-list' ref={platformDropdownRef}>
                {CONFIG.platforms.map(platform => {
                    if (platform.title === 'SmartTrader') {
                        const related_deriv_origin = getRelatedDerivOrigin();
                        platform.link = `https://${related_deriv_origin.prefix}smarttrader.deriv.${
                            related_deriv_origin.extension
                        }/${lang || 'en'}/trading`;
                    }

                    const is_binary_bot = platform.title === 'Binary Bot' && location.pathname === '/';
                    return (
                        <a
                            href={is_binary_bot ? '#' : platform.link}
                            className={classNames('platform__list-item', {
                                'platform__list-item--active': platform.title === 'Binary Bot',
                            })}
                            key={`link-to-${platform.title.replace(/ /g, '').toLowerCase()}`}
                            onClick={e => handleClick(e, is_binary_bot)}
                        >
                            <img src={platform.logo} className='platform__list-item-icon' />
                            <div className='platform__list-item-text'>
                                <div className='platform__list-item-desc'>{translate(platform.description)}</div>
                            </div>
                        </a>
                    );
                })}
            </div>
            <a href={CONFIG.tradershub.url}>
                <span>{translate('Looking for CFDs? Go to Trader\'s Hub')}</span>
            </a>
        </div>
    );
});

PlatformDropdown.propTypes = {
    hideDropdown: PropTypes.func,
    setIsPlatformSwitcherOpen: PropTypes.func,
};

export default PlatformDropdown;
