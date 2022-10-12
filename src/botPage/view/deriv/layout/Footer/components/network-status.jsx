import classNames from 'classnames';
import React from 'react';
import Popover from '../../../components/popover';
import { translate } from '../../../../../../common/utils/tools';
import api from '../../../api';
import { observer as globalObserver } from '../../../../../../common/utils/observer';

const NetworkStatus = () => {
    const [status, setStatus] = React.useState('offline');

    React.useEffect(() => {
        api.send({ website_status: '1', subscribe: 1 }).catch(e => {
            globalObserver.emit('Error', e);
        });
        api.onMessage().subscribe(({ data }) => {
            if (data?.error?.code) {
                return;
            }
            if (data?.msg_type === 'website_status') {
                $('.web-status').trigger('notify-hide');
                const { website_status } = data;
                if (website_status?.message) {
                    $.notify(website_status.message, {
                        position: 'bottom left',
                        autoHide: false,
                        className: 'warn web-status',
                    });
                }
            }
        });

        if ('onLine' in navigator) {
            window.addEventListener('online', updateStatus);
            window.addEventListener('offline', updateStatus);
        } else {
            navigator.onLine = true;
        }

        const updateInterval = setInterval(() => updateStatus(), 10000);
        updateStatus();

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);

            clearInterval(updateInterval);
        };
    }, []);

    const updateStatus = () => {
        if (navigator.onLine) {
            if (api.connection.readyState !== 1) {
                setStatus('blinker');
            } else {
                api.send({ ping: '1' })
                    .then(() => setStatus('online'))
                    .catch(e => {
                        globalObserver.emit('Error', e);
                    });
            }
        } else {
            setStatus('offline');
        }
    };

    return (
        <div id='network-status' className='network-status__wrapper'>
            <Popover content={<>{translate('Network status: {$0}', [status])}</>}>
                <div
                    className={classNames('network-status__circle', {
                        'network-status__circle--offline': status === 'offline',
                        'network-status__circle--online': status === 'online',
                        'network-status__circle--blinker': status === 'blinker',
                    })}
                />
            </Popover>
        </div>
    );
};

export default NetworkStatus;
