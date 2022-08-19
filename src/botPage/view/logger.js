import { TrackJS } from 'trackjs';
import { observer as globalObserver } from '../../common/utils/observer';
import { isMobile } from '../../common/utils/tools';
import { isIOS } from './osDetect';
import { trackJSTrack } from '../../common/integrations/trackJSTrack';

const log = (type, ...args) => {
    if (type === 'warn') {
        console.warn(...args); // eslint-disable-line no-console
    } else {
        console.log(...args); // eslint-disable-line no-console
    }
    const date = new Date();
    const timestamp = `${date.toISOString().split('T')[0]} ${date.toTimeString().slice(0, 8)} ${
        date.toTimeString().split(' ')[1]
    }`;
    globalObserver.emit('bot.notify', { type, timestamp, message: args.join(':') });
};

const notify = ({ className, message, position = 'left', sound = 'silent' }) => {
    log(className, message);

    // TODO: remove jquery dependency
    $.notify(message.toString(), { position: `bottom ${position}`, className });

    if (sound !== 'silent' && !isIOS()) {
        const audio = document.getElementById(sound);
        if (!audio && !audio.play) return;
        audio.play().catch(() => {});
    }
};

export class TrackJSError extends Error {
    constructor(type, message, optCustomData) {
        super(message);
        this.name = type;
        this.code = type;
        this.data = optCustomData;
    }
}

const notifyError = error => {
    if (!error) return;
    const { message } = trackJSTrack(error);
    notify({ className: 'error', message, position: isMobile() ? 'left' : 'right' });
};

const waitForNotifications = () => {
    const notifList = ['success', 'info', 'warn', 'error'];

    globalObserver.register('Notify', notify);

    globalObserver.register('Error', notifyError);

    notifList.forEach(className =>
        globalObserver.register(`ui.log.${className}`, message =>
            notify({ className, message, position: isMobile() ? 'left' : 'right' })
        )
    );
};

const logHandler = () => {
    const userId = document.getElementById('active-account-name')?.value;
    if (userId) {
        TrackJS.configure({ userId });
    }

    waitForNotifications();
};

export default logHandler;
