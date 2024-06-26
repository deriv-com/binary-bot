import React, { useEffect, useState } from 'react';
import { translate } from '@i18n';
import GTM from '@utilities/integrations/gtm';
import { observer as globalObserver } from '@utilities/observer';
import { getActiveLoginId } from '@storage';
import DerivAppModal from '../common/deriv-app-modal';
import { visitDerivBot } from './redirect-to-dbot';
import './move-to-dbot-banner.scss';

const updateLastPopupTime = () => {
    localStorage.setItem('last_deriv_redirect_popup_time', new Date().toString());
};

const daysBetween = (date1, date2) => {
    const one_day = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const diff_days = Math.round(Math.abs((date1 - date2) / one_day));
    return diff_days;
};

const shouldShowPopup = () => {
    const last_deriv_redirect_popup_time = localStorage.getItem('last_deriv_redirect_popup_time');

    if (!last_deriv_redirect_popup_time) {
        updateLastPopupTime();
        return true;
    }

    const allowed_delay = 1; // One week in days
    const last_popup_date = new Date(last_deriv_redirect_popup_time);
    const current_date = new Date();

    if (daysBetween(last_popup_date, current_date) >= allowed_delay) {
        updateLastPopupTime();
        return true;
    }

    return false;
};

const MoveToDbotBanner = () => {
    const container_class = 'mv-dbot-banner';
    const [open_modal, setOpenModal] = useState(false);

    useEffect(() => {
        try {
            const show_popup = shouldShowPopup();
            setOpenModal(!!show_popup);
        } catch (error) {
            globalObserver.emit('redirect pop-up error:', error);
        }
    }, []);

    const closeModal = () => {
        const user_id = getActiveLoginId();
        GTM.pushDataLayer({ event: 'bbot_cancel_redirection_popup', user_id: user_id ?? null });
        setOpenModal(false);
    };

    return (
        <div>
            {open_modal && (
                <DerivAppModal
                    title={translate('Important notice')}
                    close_on_outside_click={false}
                    primary_button={{
                        title: translate('Upgrade to Deriv Bot'),
                        onClick: visitDerivBot,
                    }}
                    onClose={closeModal}
                >
                    <div className={container_class}>
                        <div className={`${container_class}__icon-container`}>
                            <img alt='move to deriv' src='/public/images/upgrade-to-deriv-bot.svg' />
                        </div>
                        <div className={`${container_class}__title`}>{translate('Binary bot is retiring soon')} </div>
                        <div className={`${container_class}__content`}>
                            <p>{translate('Binary bot will be discontinued soon.')}</p>
                            <p>
                                {translate(
                                    'Import your existing strategies (XML files) to Deriv Bot today and enjoy a faster, more efficient trading experience with advanced features.'
                                )}
                            </p>
                        </div>
                    </div>
                </DerivAppModal>
            )}
        </div>
    );
};

export default MoveToDbotBanner;
