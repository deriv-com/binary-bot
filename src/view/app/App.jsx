import React from "react";
import {useSelector,useDispatch} from 'react-redux';
import { TrackJS } from "trackjs";
import trackjs_config from "Shared/const/trackJs_config";
import GTM from "Common/gtm";
import { symbolPromise } from "Shared";
import Loading from 'Components/loading';
import {setShowLoading} from 'Store/ui-slice';
import Routes from "../routes";

// Todo create symbol slice and update/add info from here;
const App = () => {
  const [has_symbols, setHasSymbols] = React.useState(false);
  const {show_loading,loading_type} = useSelector(state=>state.ui);
  const dispatch = useDispatch();

  TrackJS.install(trackjs_config);
  GTM.init();
  $.ajaxSetup({
    cache: false,
  });

  React.useEffect(() => {
    symbolPromise.then(() => {
      setHasSymbols(true);
      dispatch(setShowLoading(false))
    });
  }, [])
  if(show_loading){
    return <Loading type={loading_type} />
  }
  return (
    
    <Routes />
  )
}

export default App;
