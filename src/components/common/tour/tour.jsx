import React, { useState } from 'react';
import Joyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import { closeTour, getTourState } from '@storage';
import { isMobile } from '@utils';
import { translate } from '@i18n';
import welcome from './welcome';

const Tour = () => {
    const location = useLocation();
    const [run, setRun] = useState(() => (location?.pathname?.includes('endpoint') ? false : !getTourState()));
    const [step_index, setStepIndex] = useState(0);

    const closeTourPermanently = () => {
        closeTour();
        setRun(false);
    };
    const continueTour = is_checked => {
        if (is_checked) {
            closeTour();
        }
        setStepIndex(step_index + 1);
    };
    const steps = welcome(closeTourPermanently, continueTour);

    const joyrideCallback = data => {
        const { action, index, status, type } = data;
        if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
            setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
        }
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            closeTour();
        }
        if ([ACTIONS.CLOSE].includes(action)) {
            setRun(false);
        }
    };

    return (
        <div>
            <Joyride
                run={run}
                disableCloseOnEsc
                disableOverlay={!isMobile()}
                disableOverlayClicks
                continuous
                locale={{
                    open: '',
                    last: translate('Done'),
                }}
                stepIndex={step_index}
                steps={steps}
                callback={joyrideCallback}
                styles={{
                    tooltip: {
                        animation: 'joyride-animation 0.2s ease-in-out',
                        borderRadius: '4px',
                        color: '#555',
                        cursor: 'default',
                        padding: '20px',
                        pointerEvents: 'auto',
                        width: '20em',
                        zIndex: '10000',
                        position: 'fixed !important',
                        filter: 'drop-shadow(-1px -2px 3px rgba(0,0,0,0.3)) drop-shadow(1px 2px 3px rgba(0,0,0,0.1))',
                    },

                    buttonNext: {
                        backgroundColor: 'var(--color-green-btn)',
                        borderRadius: '4px',
                        color: '#fff',
                        padding: '10px 25px',
                        border: 'none',
                    },
                    buttonBack: {
                        backgroundColor: 'var(--disabled-color)',
                        color: '#000',
                        padding: '10px 25px',
                        marginRight: '8px',
                    },
                    tooltipTitle: {
                        fontSize: '20px',
                        fontWeight: '400',
                        margin: '0',
                        color: '#555',
                        textAlign: 'left',
                        paddingBottom: '5px',
                        borderBottom: '1px solid var(--color-orange)',
                    },
                    tooltipContent: {
                        textAlign: 'left',
                        padding: '0',
                    },
                }}
            />
        </div>
    );
};

export default Tour;
