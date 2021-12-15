import { notify } from '../broadcast';
import { translate } from '../../../common/i18n';

const sendWebhook = (url, payload) => {
    const onError = () => notify('warn', translate('Unable to send webhook'));
    const fetchOption = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    };

    if (payload) {
        fetchOption.body = JSON.stringify(payload);
    }

    fetch(url, fetchOption)
        .then(response => {
            if (!response.ok) {
                onError();
            }
        })
        .catch(onError);
};

const getWebhookInterface = () => ({
    sendWebhook: () => sendWebhook(),
});

export default getWebhookInterface;
