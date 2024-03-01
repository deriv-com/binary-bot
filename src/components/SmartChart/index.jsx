// eslint-disable-next-line import/no-import-module-exports
import React from 'react';

export const moduleLoader = (lazyComponent, attempts = 2, interval = 1500) =>
    new Promise((resolve, reject) => {
        lazyComponent()
            .then(resolve)
            .catch(error => {
                // let us retry after 1500 ms
                setTimeout(() => {
                    if (attempts === 1) {
                        reject(error);
                        return;
                    }
                    moduleLoader(lazyComponent, attempts - 1, interval).then(resolve, reject);
                }, interval);
            });
    });

export const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

let module;

const init = () => {
    module = moduleLoader(() => import(/* webpackChunkName: "smart_chart" */ '@deriv/deriv-charts'));

    module.then(({ setSmartChartsPublicPath }) => {
        setSmartChartsPublicPath(getUrlBase('./js/'));
    });
};

// React.Lazy expects a default export for the component
// SmartChart library exports many components
const load = component_name => () => {
    if (!module) {
        init();
    }
    return module.then(module_tmp => ({ default: module_tmp[component_name] }));
};

export const SmartChart = React.lazy(load('SmartChart'));
export const ChartTitle = React.lazy(load('ChartTitle'));

export const ChartSize = React.lazy(load('ChartSize'));
export const ChartMode = React.lazy(load('ChartMode'));
export const DrawTools = React.lazy(load('DrawTools'));
export const Share = React.lazy(load('Share'));
export const StudyLegend = React.lazy(load('StudyLegend'));
export const Views = React.lazy(load('Views'));
export const ToolbarWidget = React.lazy(load('ToolbarWidget'));

export const FastMarker = React.lazy(load('FastMarker'));
export const RawMarker = React.lazy(load('RawMarker'));
