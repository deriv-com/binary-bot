import React from 'react';
import PropTypes from 'prop-types';
import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from '../SmartChart';

// eslint-disable-next-line react/prop-types
const ToolbarWidgets = ({ updateChartType, updateGranularity }) => (
    <>
        <div id='chart_modal_root'></div>
        <ToolbarWidget position='left'>
            <ChartMode
                portalNodeId='chart_modal_root'
                onChartType={updateChartType}
                onGranularity={updateGranularity}
            />

            <>
                <StudyLegend portalNodeId='chart_modal_root' searchInputClassName='data-hj-whitelist' />
                <Views portalNodeId='chart_modal_root' searchInputClassName='data-hj-whitelist' />
                <DrawTools portalNodeId='chart_modal_root' />
                <Share />
            </>
        </ToolbarWidget>
    </>
);

ToolbarWidgets.propTypes = {
    handleStateChange: PropTypes.func,
};

export default ToolbarWidgets;
