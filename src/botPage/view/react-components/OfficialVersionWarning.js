import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'Translate';

// [Todo] remove styles
const bottomWarningLinkStyle = { textDecoration: 'underline' };
const bottomWarningStyle = {
    bottom    : '0px',
    position  : 'fixed',
    zIndex    : 9999,
    background: '#c03',
    color     : 'white',
    width     : '100%',
    textAlign : 'center',
    lineHeight: '25px',
    fontSize  : '0.8em',
};

const OfficialVersionWarning = ({ show }) =>
    show ? (
        <div style={bottomWarningStyle}>
            <div id="end-note">
                {`${translate('This is not an official version of Binary Bot, use at your own risk.')} `}
                <a style={bottomWarningLinkStyle} href="https://bot.binary.com/bot.html">
                    {translate('Official Version')}
                </a>
            </div>
        </div>
    ) : null;

OfficialVersionWarning.propTypes = {
    show: PropTypes.bool.isRequired,
};

export default OfficialVersionWarning;
