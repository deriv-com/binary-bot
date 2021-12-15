import { notify } from '../broadcast';
import { translate } from '../../../common/i18n';
import { observer as globalObserver } from '../../../common/utils/observer';

const notifyTelegram = (accessToken, chatId, text) => {
    const url = `https://api.telegram.org/bot${accessToken}/sendMessage`;
    const onError = () => notify('warn', translate('The Telegram notification could not be sent'));

    fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
    })
        .then(response => {
            if (!response.ok) {
                onError();
            }
        })
        .catch(onError);
};

const getMiscInterface = tradeEngine => {
    const { tradeOptions, getTotalRuns, getBalance, getTotalProfit } = tradeEngine;

    return {
        notify: args => globalObserver.emit('Notify', args),
        notifyTelegram: () => notifyTelegram(),
        getTotalRuns: () => getTotalRuns(),
        getBalance: type => getBalance(type),
        getTotalProfit: toString => getTotalProfit(toString, tradeOptions.currency),
    };
};

export default getMiscInterface;
