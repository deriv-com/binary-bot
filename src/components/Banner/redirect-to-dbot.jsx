import GTM from '@utilities/integrations/gtm';
import { getActiveLoginId } from '@storage';

const visitDerivBot = () => {
    const user_id = getActiveLoginId();
    GTM.pushDataLayer({ event: 'bbot_moved_to_deriv_bot', user_id: user_id ?? null });
    window.open('https://app.deriv.com/bot/?redirect_from_bbot=1', '_self', 'noopener');
};

export default visitDerivBot;
