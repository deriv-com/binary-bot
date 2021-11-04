import React from "react";
import  Popover from '../../../components/popover.jsx';

const ServerTime = ({ api }) => {
    const [hasApiResponse, setHasApiResponse] = React.useState(false);
    const [date, setDate] = React.useState();
    const [dateString, setDateString] = React.useState();

    const updateTime = () => {
        if (!date) return;
        if (!navigator.onLine || api.socket.readyState !== 1 || document.visibilityState !== 'visible') setHasApiResponse(false);

        if (!hasApiResponse) getServerTime();

        date.setSeconds(date.getSeconds() + 1);

        const year = date.getUTCFullYear();
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        const day = `0${date.getUTCDate()}`.slice(-2);
        const hours = `0${date.getUTCHours()}`.slice(-2);
        const minutes = `0${date.getUTCMinutes()}`.slice(-2);
        const seconds = `0${date.getUTCSeconds()}`.slice(-2);

        setDateString(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT`);
    };

    const getServerTime = () => {
        api.send({ time: 1 }).then(response => {
            const newDate = new Date(response.time * 1000);
            setDate(newDate);
            setHasApiResponse(true);
        });
    };

    React.useEffect(() => {
        getServerTime();

        const socketCloseHandler = () => setHasApiResponse(false);
        api.socket.addEventListener("close", socketCloseHandler);

        const updateTimeInterval = setInterval(updateTime, 1000);
        const serverTimeInterval = setInterval(getServerTime, 30000);

        return () => {
            api.socket.removeEventListener("close", socketCloseHandler);
            clearInterval(updateTimeInterval);
            clearInterval(serverTimeInterval);
        };
    }, [hasApiResponse]);

    React.useEffect(() => updateTime(), [date]);

    return (
        <Popover content={<>{dateString}</>}>
            <div id="server-time" className="server-time">{dateString}</div>
        </Popover>
    )
};

export default ServerTime;
