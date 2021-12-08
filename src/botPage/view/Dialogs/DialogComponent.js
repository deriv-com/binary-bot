import React from 'react';
import PropTypes from 'prop-types';
import 'jquery-ui/ui/widgets/dialog';

const createDialog = (el, title, { height = 150, width = 300, resize, resizable = true }) => {
    $(el).dialog({
        resizable,
        height,
        width,
        title,
        autoOpen: false,
        closeText: '',
        classes: { 'ui-dialog-titlebar-close': 'icon-close' },
        resize,
    });
};

const PanelComponent = ({ id, content, title, options }) => (
    <div id={id} ref={el => createDialog(el, title, options)}>
        {content}
    </div>
);

PanelComponent.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.object,
    options: PropTypes.object,
};

export default PanelComponent;
