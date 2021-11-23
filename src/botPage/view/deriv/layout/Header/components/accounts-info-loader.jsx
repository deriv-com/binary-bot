import ContentLoader from 'react-content-loader';
import React from 'react';
import PropTypes from 'prop-types';

const AccountsInfoLoader = ({ is_mobile, speed = 3 }) => (
    <ContentLoader
        height={is_mobile ? 42 : 46}
        width={is_mobile ? 216 : 350}
        speed={speed}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
    >
        {is_mobile ? (
            <React.Fragment>
                <circle cx='59' cy='22' r='13' />
                <circle cx='97' cy='22' r='13' />
                <rect x='128' y='19' rx='4' ry='4' width='76' height='7' />
            </React.Fragment>
        ) : (
            <React.Fragment>
                <circle cx='14' cy='22' r='12' />
                <circle cx='58' cy='22' r='12' />
                <rect x='87' y='8' rx='4' ry='4' width='1' height='30' />
                <circle cx='118' cy='24' r='13' />
                <rect x='150' y='20' rx='4' ry='4' width='76' height='7' />
                <rect x='250' y='8' rx='4' ry='4' width='82' height='32' />
            </React.Fragment>
        )}
    </ContentLoader>
);

AccountsInfoLoader.propTypes = {
    speed: PropTypes.number,
};

export default AccountsInfoLoader;
