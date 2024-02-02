import React from 'react';
import { translate } from '@i18n';
import GoogleDriveIntegration from '@components/GoogleDriveIntegration';
import PropTypes from 'prop-types';
import { DraggableResizeWrapper } from '../Draggable';
import * as style from '../style';

const IntegrationsContent = () => (
    <div id='integrations-dialog' className='dialog-content' style={style.content}>
        <GoogleDriveIntegration />
    </div>
);

const GoogleDriveModal = ({ setShowGoogleDrive }) => (
    <DraggableResizeWrapper
        boundary={'.main'}
        minWidth={500}
        minHeight={170}
        header={translate('Google Drive Integration')}
        onClose={() => setShowGoogleDrive(is_shown => !is_shown)}
        modalWidth={500}
        modalHeight={170}
    >
        <IntegrationsContent />
    </DraggableResizeWrapper>
);

export default GoogleDriveModal;

GoogleDriveModal.propTypes = {
    setShowGoogleDrive: PropTypes.func.isRequired,
};
