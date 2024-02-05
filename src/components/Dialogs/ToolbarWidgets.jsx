import React from 'react';
import PropTypes from 'prop-types';
import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from '../SmartChart';

// eslint-disable-next-line react/prop-types
const ToolbarWidgets = ({ updateChartType, updateGranularity }) => (
    <>
        <div id='modal_root'></div>
        <ToolbarWidget position='left'>
            <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />

            <>
                <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                <DrawTools portalNodeId='modal_root' />
                <Share portalNodeId='modal_root' />
            </>
        </ToolbarWidget>
    </>
);

ToolbarWidgets.propTypes = {
    handleStateChange: PropTypes.func,
};

export default ToolbarWidgets;
