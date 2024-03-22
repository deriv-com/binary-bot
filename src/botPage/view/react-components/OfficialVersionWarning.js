import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '@i18n';
import './official-version-warning.scss';

const OfficialVersionWarning = ({ show }) =>
    show ? (
        <div className='version-warning'>
            <div id='end-note'>
                {`${translate('This is not an official version of Binary Bot, use at your own risk.')} `}
                <a href='https://bot.deriv.com'>{translate('Official Version')}</a>
            </div>
        </div>
    ) : null;

OfficialVersionWarning.propTypes = {
    show: PropTypes.bool.isRequired,
};

export default OfficialVersionWarning;
