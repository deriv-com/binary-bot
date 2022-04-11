import React from 'react';
import Dialog from './Dialog';
import GoogleDriveIntegration from '../react-components/Integrations/GoogleDriveIntegration';
import { translate } from 'Translate';

// [Todo] remove styles
const contentStyle = {
    marginTop: '0.5em',
};

const IntegrationsContent = () => (
    <div id="integrations-dialog" className="dialog-content" style={contentStyle}>
        <GoogleDriveIntegration />
    </div>
);

export default class IntegrationsDialog extends Dialog {
    constructor() {
        const closeDialog = () => {
            this.close();
        };
        super(
            'integrations-dialog',
            translate('Google Drive Integration'),
            <IntegrationsContent closeDialog={closeDialog} />,
            {
                width : 500,
                height: 'auto',
            }
        );
        this.registerCloseOnOtherDialog();
    }
}
