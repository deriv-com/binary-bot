import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const isEmptyObject = obj => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(key => {
            if (Object.hasOwn(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

const Text = ({
    children,
    size = 's',
    color = 'general',
    align = 'left',
    weight = 'normal',
    line_height = 'm',
    as,
    className,
    styles,
    ...props
}) => {
    const class_styles = {
        '--text-size': `var(--font-size-${size})`,
        '--text-color': `var(--text-${color})`,
        '--text-lh': `var(--text-lh-${line_height})`,
        '--text-weight': `var(--text-weight-${weight})`,
        '--text-align': `var(--text-align-${align})`,
    };
    const [style, setStyle] = React.useState(class_styles);
    React.useEffect(() => {
        if (!isEmptyObject(styles)) {
            const combined_style = { ...class_styles, ...styles };
            setStyle(combined_style);
        } else {
            setStyle(class_styles);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size, color, line_height, weight, align]);
    const class_names = classNames('dc-text', className);
    return React.createElement(as || 'span', { className: class_names, style, ...props }, children);
};

Text.propTypes = {
    children: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    align: PropTypes.string,
    weight: PropTypes.string,
    line_height: PropTypes.string,
    as: PropTypes.string,
    className: PropTypes.string,
    styles: PropTypes.string,
};

export default Text;
