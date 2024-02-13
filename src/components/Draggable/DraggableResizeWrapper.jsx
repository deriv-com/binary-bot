import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from '../../utilities/utility-functions';
import Draggable from './Draggable';

const DraggableResizeWrapper = ({
    boundary,
    children,
    onClose = () => {},
    enableResizing = false,
    enableDragging = true,
    header = '',
    minHeight = 100,
    minWidth = 100,
    modalHeight = 400,
    modalWidth = 400,
}) => {
    const [show, setShow] = useState(false);
    const xAxisValue = (window.innerWidth - modalWidth) / 2;
    const yAxisValue = (window.innerHeight - modalHeight) / 2;

    const [initialValues, setInitialValues] = React.useState({
        width: modalWidth,
        height: modalHeight,
        xAxis: xAxisValue >= 0 ? xAxisValue : 0,
        yAxis: yAxisValue >= 0 ? yAxisValue : 0,
    });

    const handleResize = debounce(() => {
        const newWidth = window.innerWidth > modalWidth ? modalWidth : window.innerWidth - 50;
        const newHeight = window.innerHeight > modalHeight ? modalHeight : window.innerHeight - 50;
        const newx = (window.innerWidth - newWidth) / 2;
        const newy = (window.innerHeight - newHeight) / 2;

        setInitialValues({
            width: newWidth,
            height: newHeight,
            xAxis: newx >= 0 ? newx : 0,
            yAxis: newy >= 0 ? newy : 0,
        });
        setShow(true);
    }, 300);

    React.useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div id='draggable_resize_container'>
            {show && (
                <Draggable
                    boundary={boundary}
                    initialValues={initialValues}
                    minWidth={minWidth}
                    minHeight={minHeight}
                    enableResizing={enableResizing}
                    enableDragging={enableDragging}
                    header={header}
                    onClose={onClose}
                >
                    {children}
                </Draggable>
            )}
        </div>
    );
};

DraggableResizeWrapper.propTypes = {
    boundary: PropTypes.string,
    children: PropTypes.node,
    enableDragging: PropTypes.bool,
    enableResizing: PropTypes.bool,
    header: PropTypes.node,
    minHeight: PropTypes.number,
    modalHeight: PropTypes.number,
    modalWidth: PropTypes.number,
    minWidth: PropTypes.number,
    onClose: PropTypes.func,
};

export default DraggableResizeWrapper;
