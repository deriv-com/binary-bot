import React from 'react';
import { TrackJS } from 'trackjs';
import GTM from '../../../../common/gtm';
import { symbolPromise } from '../../shared';
import Routes from '../routes';
import api_base from '../api_base';
import { load as loadLang } from '../../../../common/lang';
// eslint-disable-next-line import/no-named-as-default
import trackjs_config from '../../trackJs_config';

// Todo create symbol slice and update/add info from here;
const App = () => {
    const [has_symbols, setHasSymbols] = React.useState(false);
    TrackJS.install(trackjs_config);
    GTM.init();
    $.ajaxSetup({
        cache: false,
    });

    loadLang();

    React.useEffect(() => {
        symbolPromise.then(() => {
            setHasSymbols(true);
        });
    }, [api_base.api]);

    if (!has_symbols) return null; // Todo: add fallback

    return <Routes />;
};

export default App;
