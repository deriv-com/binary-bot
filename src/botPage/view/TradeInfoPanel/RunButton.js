import React from 'react';
import { translate } from '@i18n';

const RunButton = () => (
    <React.Fragment>
        <button
            title='Run the bot'
            id='summaryRunButton'
            className='toolbox-button icon-run'
            onClick={() => {
                $('#runButton').trigger('click');
            }}
        />
        <button
            title={translate('Stop the bot')}
            id='summaryStopButton'
            className='toolbox-button icon-stop'
            style={{ display: 'none' }}
            onClick={() => {
                $('#stopButton').trigger('click');
            }}
        />
    </React.Fragment>
);

export default RunButton;
