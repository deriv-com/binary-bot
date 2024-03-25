import GTM from '@utilities/integrations/gtm';
import { getActiveLoginId } from '@storage';

export const visitDerivBot = () => {
    const user_id = getActiveLoginId();
    GTM.pushDataLayer({ event: 'bbot_moved_to_deriv_bot', user_id: user_id ?? null });
    const isStaging = process.env.NODE_ENV === 'staging';
    if (isStaging) {
        window.open('https://staging-app.deriv.com/bot/?redirect_from_bbot=1', '_self', 'noopener');
    }
    window.open('https://app.deriv.com/bot/?redirect_from_bbot=1', '_self', 'noopener');
};
