import React, { useEffect, useState } from 'react';
import { translate } from '@i18n';
import GTM from '@utilities/integrations/gtm';
import { observer as globalObserver } from '@utilities/observer';
import { getActiveLoginId } from '@storage';
import DerivAppModal from '../common/deriv-app-modal';
import { visitDerivBot } from './redirect-to-dbot';
import './move-to-dbot-banner.scss';

const updateLastPopupTime = () => {
    localStorage.setItem('migration_popup_timer', new Date().toString());
};

const daysBetween = (date1, date2) => {
    const one_day = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const diff_days = Math.round(Math.abs((date1 - date2) / one_day));
    return diff_days;
};

const shouldShowPopup = () => {
    const migration_popup_timer = localStorage.getItem('migration_popup_timer');

    if (!migration_popup_timer) {
        updateLastPopupTime();
        return true;
    }

    const allowed_delay = 1; // One week in days
    const last_popup_date = new Date(migration_popup_timer);
    const current_date = new Date();

    if (daysBetween(last_popup_date, current_date) >= allowed_delay) {
        updateLastPopupTime();
        return true;
    }

    return false;
};

const MoveToDbotBanner = () => {
    const container_class = 'mv-dbot-banner';
    const [open_modal, setOpenModal] = useState(true);

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
                        <div className={`${container_class}__title`}>
                            {translate('Binary bot is retiring on 31 August 2024')}{' '}
                        </div>
                        <div className={`${container_class}__content`}>
                            <p>
                                {translate(
                                    'Follow these steps to keep trading with your favourite strategies on Deriv Bot:'
                                )}
                            </p>
                            <ol className={`${container_class}__orderd-list`}>
                                <li>{translate('Download your Binary Bot strategy in XML format.')}</li>
                                <li>{translate('Switch to Deriv Bot and import your strategy.')}</li>
                                <li>{translate('Run your updated strategy to check its performance.')}</li>
                                <li>{translate('Save the updated strategy for quicker re-imports.')}</li>
                            </ol>
                            <p>{translate('Upgrade today and experience seamless trading on Deriv Bot.')}</p>
                        </div>
                    </div>
                </DerivAppModal>
            )}
        </div>
    );
};

export default MoveToDbotBanner;
