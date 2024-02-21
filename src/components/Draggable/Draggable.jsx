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
const BODY_REF = 'body';
const SAFETY_MARGIN = 7;
const EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN = 3;

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
    const [position, setPosition] = useState({ x: initialValues.xAxis, y: initialValues.yAxis });
    const [size, setSize] = useState({ width: initialValues.width, height: initialValues.height });
    const [zIndex, setZIndex] = useState(100);

    const isResizing = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const draggableRef = useRef(null);
    const [boundaryRef, setBoundaryRef] = useState(document.querySelector(boundary ?? BODY_REF));

    useEffect(() => {
        setSize({ width: initialValues.width, height: initialValues.height });
        setPosition({ x: initialValues.xAxis, y: initialValues.yAxis });
    }, [initialValues]);

    useEffect(() => {
        const boundaryEl = document.querySelector(boundary ?? BODY_REF);
        setBoundaryRef(boundaryEl);
        calculateZindex();
    }, [boundary]);

    const calculateZindex = () => {
        const draggableModals = document.getElementsByClassName('draggable');
        if (!draggableModals.length) return;
        const maxZIndex = Array.from(draggableModals).reduce(
            (maxZ, modal) => Math.max(maxZ, parseInt(window.getComputedStyle(modal).zIndex) || 0),
            0
        );
        const newZIndex = maxZIndex + 3;
        setZIndex(newZIndex);
    };

    const handleMouseDown = (event, action) => {
        event.stopPropagation();
        calculateZindex();
        if (!action) return;
        const resize_direction = action;
        isResizing.current = action !== MOVE && enableResizing;
        setIsDragging(action === MOVE && enableDragging);

        const boundaryRect = boundaryRef?.getBoundingClientRect();
        const topOffset = boundaryRef?.offsetTop ?? 0;
        const leftOffset = boundaryRef?.offsetLeft ?? 0;
        const initialMouseX = event?.clientX ?? 0;
        const initialMouseY = event?.clientY ?? 0;
        const initialWidth = size?.width ?? initialValues.width;
        const initialHeight = size?.height ?? initialValues.height;
        const initialX = position?.x ?? 0;
        const initialY = position?.y ?? 0;
        const initialSelfRight = draggableRef.current?.getBoundingClientRect()?.right ?? size.width;
        const initialSelfBottom = draggableRef.current?.getBoundingClientRect()?.bottom ?? size.height;

        let previousStyle = {};
        const draggableContentBody = draggableRef.current?.querySelector('#draggable-content-body');

        if (draggableContentBody) {
            const { style } = draggableContentBody;
            if (style && style.pointerEvents !== 'none') {
                previousStyle = style;
                style.pointerEvents = 'none';
            }
        }

        const handleMouseMove = e => {
            if (!e) return;
            const { clientX, clientY } = e;
            const deltaX = clientX - initialMouseX;
            const deltaY = clientY - initialMouseY;
            try {
                if (isResizing.current) {
                    handleResize(deltaX, deltaY, clientX, clientY);
                } else {
                    handleDrag(deltaX, deltaY);
                }
            } catch (error) {
                handleMouseUp();
            }
        };

        const handleResize = (deltaX, deltaY, clientX, clientY) => {
            let newX = position?.x ?? 0;
            let newY = position?.y ?? 0;
            let newWidth = initialWidth;
            let newHeight = initialHeight;

            if (resize_direction.includes(RIGHT)) {
                newWidth += deltaX;
            } else if (resize_direction.includes(LEFT)) {
                newX = deltaX + initialX;
                newWidth -= deltaX;
            }

            if (resize_direction.includes(BOTTOM)) {
                newHeight += deltaY;
            } else if (resize_direction.includes(TOP)) {
                newY = deltaY + initialY;
                newHeight -= deltaY;
            }

            setPosition(prev => {
                const maxY = Math.max(newY, topOffset + SAFETY_MARGIN);
                const maxX = Math.max(newX, leftOffset + SAFETY_MARGIN);
                return { x: newWidth <= minWidth ? prev.x : maxX, y: newHeight <= minHeight ? prev.y : maxY };
            });

            const self = draggableRef.current?.getBoundingClientRect();

            const calculateWidth = prevWidth => {
                const leftLimit = leftOffset + SAFETY_MARGIN;
                const rightLimit =
                    boundaryRect.left + boundaryRect.width - (SAFETY_MARGIN + EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN);
                const calculatedPreviousWidth = rightLimit - leftLimit - (rightLimit - initialSelfRight);
                if (resize_direction.includes(LEFT)) {
                    if (newWidth >= minWidth && clientX > leftLimit) return newWidth;
                    if (clientX < leftLimit) return calculatedPreviousWidth;
                    return prevWidth;
                }
                if (resize_direction.includes(RIGHT)) {
                    if (newWidth >= minWidth && clientX < rightLimit) return newWidth;
                    if (clientX > rightLimit) return rightLimit - self.left;
                    return prevWidth;
                }
                return prevWidth;
            };

            const calculateHeight = prevHeight => {
                const topLimit = topOffset + SAFETY_MARGIN;
                const bottomLimit =
                    boundaryRect.top + boundaryRect.height - (SAFETY_MARGIN + EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN);
                const calculatedPreviousHeight = bottomLimit - topLimit - (bottomLimit - initialSelfBottom);
                if (resize_direction.includes(TOP)) {
                    if (newHeight >= minHeight && clientY > topLimit) return newHeight;
                    if (clientY < topLimit) return calculatedPreviousHeight;
                    return prevHeight;
                }
                if (resize_direction.includes(BOTTOM)) {
                    if (newHeight >= minHeight && clientY < bottomLimit) return newHeight;
                    if (clientY > bottomLimit) return bottomLimit - self.top;
                    return prevHeight;
                }
                return prevHeight;
            };

            setSize(prev => ({
                width: calculateWidth(prev.width),
                height: calculateHeight(prev.height),
            }));
        };

        const handleDrag = (deltaX, deltaY) => {
            const newX = deltaX + initialX;
            const newY = deltaY + initialY;
            const boundedX = Math.min(
                Math.max(newX, leftOffset + SAFETY_MARGIN),
                leftOffset + boundaryRect.width - size.width - (SAFETY_MARGIN + EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN * 2)
            );
            const boundedY = Math.min(
                Math.max(newY, topOffset + SAFETY_MARGIN),
                topOffset + boundaryRect.height - size.height - (SAFETY_MARGIN + EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN * 2)
            );
            setPosition({ x: boundedX, y: boundedY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            isResizing.current = false;
            if (draggableContentBody?.style) draggableContentBody.style = previousStyle;
            if (boundaryRef) {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }
        };

        if (boundaryRef) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    };

    return (
        <div
            className={`draggable ${isDragging ? 'dragging' : ''}`}
            style={{ position: 'absolute', top: position.y, left: position.x, zIndex }}
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
                <span className='draggable-content__body' id='draggable-content-body'>
                    {children}
                </span>
                {enableResizing && (
                    <>
                        <div
                            className='resizable-handle__top'
                            role='button'
                            onKeyDown={e => handleMouseDown(e, TOP)}
                            onMouseDown={e => handleMouseDown(e, TOP)}
                        />
                        <div
                            className='resizable-handle__right'
                            role='button'
                            onKeyDown={e => handleMouseDown(e, RIGHT)}
                            onMouseDown={e => handleMouseDown(e, RIGHT)}
                        />
                        <div
                            className='resizable-handle__bottom'
                            role='button'
                            onKeyDown={e => handleMouseDown(e, BOTTOM)}
                            onMouseDown={e => handleMouseDown(e, BOTTOM)}
                        />
                        <div
                            className='resizable-handle__left'
                            role='button'
                            onKeyDown={e => handleMouseDown(e, LEFT)}
                            onMouseDown={e => handleMouseDown(e, LEFT)}
                        />
                        <div
                            className='resizable-handle__top-right'
                            role='button'
                            onKeyDown={e => handleMouseDown(e, TOP_RIGHT)}
                            onMouseDown={e => handleMouseDown(e, TOP_RIGHT)}
                        />
                        <div
                            className='resizable-handle__bottom-right'
                            role='button'
                            onKeyDown={e => handleMouseDown(e, BOTTOM_RIGHT)}
                            onMouseDown={e => handleMouseDown(e, BOTTOM_RIGHT)}
                        />
                        <div
                            className='resizable-handle__bottom-left'
                            role='button'
                            onKeyDown={e => handleMouseDown(e, BOTTOM_LEFT)}
                            onMouseDown={e => handleMouseDown(e, BOTTOM_LEFT)}
                        />
                        <div
                            className='resizable-handle__top-left'
                            role='button'
                            onKeyDown={e => handleMouseDown(e, TOP_LEFT)}
                            onMouseDown={e => handleMouseDown(e, TOP_LEFT)}
                        />
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
};

export default Draggable;
