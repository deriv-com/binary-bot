import React from 'react';

// [Todo] remove styles
const exportButtonStyle = {
    position: 'absolute',
    left    : '41em',
    zIndex  : 2,
    padding : 0,
    width   : '2em',
    height  : '2em',
};

const ExportButton = ({ onClick, customStyle }) => (
    <button onClick={onClick} style={{ ...exportButtonStyle, ...customStyle }} className="icon-save" />
);

export default ExportButton;
