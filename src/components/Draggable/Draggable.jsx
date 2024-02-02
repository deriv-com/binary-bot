import React, { useState, useRef, useEffect } from 'react';
import './draggable.scss';
import PropTypes from 'prop-types';

const MOVE = 'move';
const TOP = 'top';
const RIGHT = 'right';
const BOTTOM = 'bottom';
const LEFT = 'left';
const TOP_RIGHT = 'top-right';
const BOTTOM_RIGHT = 'bottom-right';
const BOTTOM_LEFT = 'bottom-left';
const TOP_LEFT = 'top-left';
const BODY_REF = '.body';

const Draggable = ({
    children,
    boundary,
    initialValues = {
        width: 400,
        height: 400,
        xAxis: 0,
        yAxis: 0,
    },
    minWidth = 100,
    minHeight = 100,
    enableResizing = false,
    enableDragging = true,
    header = '',
    onClose = () => {},
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: initialValues.xAxis, y: initialValues.yAxis });
    const [size, setSize] = useState({ width: initialValues.width, height: initialValues.height });
    const draggableRef = useRef(null);
    const boundaryRef = useRef(document.querySelector(boundary ?? BODY_REF));
    const isResizing = useRef(false);

    const boundaryRect = boundaryRef.current?.getBoundingClientRect();
    const boundaryTop = boundaryRect ? boundaryRect.top + window.scrollY : 0;
    const boundaryBottom = boundaryRect ? boundaryRect.bottom + window.scrollY : window.innerHeight;
    const boundaryLeft = boundaryRect ? boundaryRect.left + window.scrollX : 0;
    const boundaryRight = boundaryRect ? boundaryRect.right + window.scrollX : window.innerWidth;

    useEffect(() => {
        setSize({ width: initialValues.width, height: initialValues.height });
        setPosition({ x: initialValues.xAxis, y: initialValues.yAxis });
    }, [initialValues]);

    useEffect(() => {
        boundaryRef.current = document.querySelector(boundary ?? BODY_REF);
    }, [boundary]);

    const handleMouseDown = (event, action) => {
        event.stopPropagation();
        if (!action) return;
        const resize_direction = action;
        if (resize_direction !== MOVE && enableResizing) {
            isResizing.current = true;
        } else if (action === MOVE && enableDragging) {
            isResizing.current = false;
            setIsDragging(true);
        } else {
            return;
        }

        const initialMouseX = event?.clientX ?? 0;
        const initialMouseY = event?.clientY ?? 0;
        const initialWidth = size?.width;
        const initialHeight = size?.height;
        const initialX = position?.x;
        const initialY = position?.y;

        const handleMouseMove = e => {
            const deltaX = e.clientX - initialMouseX;
            const deltaY = e.clientY - initialMouseY;
            if (isResizing.current) {
                handleResize(deltaX, deltaY);
            } else {
                handleDrag(deltaX, deltaY);
            }
        };

        const handleResize = (deltaX, deltaY) => {
            let newX = position?.x;
            let newY = position?.y;
            let newWidth = initialWidth;
            let newHeight = initialHeight;

            if (resize_direction.includes(RIGHT)) {
                newWidth += deltaX;
                if (newWidth <= minWidth) {
                    newWidth = minWidth;
                }
            } else if (resize_direction.includes(LEFT)) {
                newWidth = Math.max(newWidth - deltaX, minWidth);
                newX = deltaX + initialX;
                const boundedLeftX = Math.max(newX, boundaryLeft);
                setPosition(prev => {
                    if (newWidth <= minWidth) {
                        return { x: prev.x, y: prev.y };
                    }
                    return {
                        x: boundedLeftX,
                        y: prev.y,
                    };
                });
            }

            if (resize_direction.includes(BOTTOM)) {
                newHeight += deltaY;
                if (newHeight <= minHeight) {
                    newHeight = minHeight;
                }
            } else if (resize_direction.includes(TOP)) {
                newHeight = Math.max(newHeight - deltaY, minHeight);
                newY = deltaY + initialY;
                setPosition(prev => {
                    const boundedTopY = Math.max(newY, boundaryTop);
                    if (newHeight <= minHeight) {
                        return { x: prev.x, y: prev.y };
                    }
                    return { x: prev.x, y: boundedTopY };
                });
            }

            const maxBoundedWidth = boundaryRef.current
                ? boundaryRef.current.getBoundingClientRect().right - newX
                : window.innerWidth - newX;
            const maxBoundedHeight = boundaryRef.current
                ? boundaryRef.current.getBoundingClientRect().bottom - newY
                : window.innerHeight - newY;

            const boundedWidth = Math.min(newWidth, maxBoundedWidth < minWidth ? minWidth : maxBoundedWidth);
            const boundedHeight = Math.min(newHeight, maxBoundedHeight < minHeight ? minHeight : maxBoundedHeight);

            if (resize_direction.includes(LEFT) || resize_direction.includes(TOP)) {
                const width = initialWidth - deltaX;
                const height = initialHeight - deltaY;
                setSize(prev => ({
                    width: newX >= boundaryLeft || width <= minWidth ? boundedWidth : prev.width,
                    height: newY >= boundaryTop || height <= minHeight ? boundedHeight : prev.height,
                }));
                return;
            }
            setSize(prev => ({
                width: newX <= boundaryRight ? boundedWidth : prev.width,
                height: newY <= boundaryBottom ? boundedHeight : prev.height,
            }));
        };

        const handleDrag = (deltaX, deltaY) => {
            const newX = deltaX + initialX;
            const newY = deltaY + initialY;

            const boundedX = Math.min(Math.max(newX, boundaryLeft), boundaryRight - size.width);
            const boundedY = Math.min(Math.max(newY, boundaryTop), boundaryBottom - size.height);

            setPosition({ x: boundedX, y: boundedY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            isResizing.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className={`draggable ${isDragging ? 'dragging' : ''}`}
            style={{ position: 'absolute', top: position.y, left: position.x }}
        >
            <div ref={draggableRef} className='draggable-content' style={{ width: size.width, height: size.height }}>
                <div className='draggable-content__header' onMouseDown={e => handleMouseDown(e, MOVE)}>
                    <div>{header}</div>
                    <div>
                        <button
                            type='button'
                            className='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close icon-close'
                            onClick={onClose}
                        >
                            <span className='ui-button-icon ui-icon ui-icon-closethick'></span>
                        </button>
                    </div>
                </div>
                <span className='draggable-content__body'>{children}</span>
                {enableResizing && (
                    <>
                        <div className='resizable-handle__top' onMouseDown={e => handleMouseDown(e, TOP)} />
                        <div className='resizable-handle__right' onMouseDown={e => handleMouseDown(e, RIGHT)} />
                        <div className='resizable-handle__bottom' onMouseDown={e => handleMouseDown(e, BOTTOM)} />
                        <div className='resizable-handle__left' onMouseDown={e => handleMouseDown(e, LEFT)} />
                        <div className='resizable-handle__top-right' onMouseDown={e => handleMouseDown(e, TOP_RIGHT)} />
                        <div
                            className='resizable-handle__bottom-right'
                            onMouseDown={e => handleMouseDown(e, BOTTOM_RIGHT)}
                        />
                        <div
                            className='resizable-handle__bottom-left'
                            onMouseDown={e => handleMouseDown(e, BOTTOM_LEFT)}
                        />
                        <div className='resizable-handle__top-left' onMouseDown={e => handleMouseDown(e, TOP_LEFT)} />
                    </>
                )}
            </div>
        </div>
    );
};

Draggable.propTypes = {
    children: PropTypes.node,
    boundary: PropTypes.string,
    initialValues: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        xAxis: PropTypes.number,
        yAxis: PropTypes.number,
    }),
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    enableResizing: PropTypes.bool,
    enableDragging: PropTypes.bool,
    header: PropTypes.node,
    onClose: PropTypes.func,
    draggableRef: PropTypes.object,
};

export default Draggable;
