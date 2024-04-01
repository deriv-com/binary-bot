import GTM from '@utilities/integrations/gtm';
import { getActiveLoginId } from '@storage';
import { getRelatedDerivOrigin } from '@utils';

export const visitDerivBot = () => {
    const user_id = getActiveLoginId();
    GTM.pushDataLayer({ event: 'bbot_moved_to_deriv_bot', user_id: user_id ?? null });
    const { origin } = getRelatedDerivOrigin();
    window.open(`${origin}/bot/?redirect_from_bbot=1`, '_self', 'noopener');
};
