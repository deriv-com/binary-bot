import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {api} from '../../../View';
import Tour from '../../../tour'
import { get as getStorage, isDone } from '../../../../../common/utils/storageManager';
import {updateShowTour} from '../../store/ui-slice';
import ToolBox from '../toolbox/toolbox.jsx';
import Header from '../Header'
import Footer from '../Footer';
import Workspace from '../workspace';


const Main = ({api,clientInfo})=>{
    const {show_tour} = useSelector(state => state.ui);
    const dispatch = useDispatch()
    React.useEffect(()=>{
        const day_has_passed = Date.now() > (parseInt(getStorage('closedTourPopup')) || 0) + 24 * 60 * 60 * 1000;
        dispatch(updateShowTour(isDone('welcomeFinished') || day_has_passed))
    },[])
    return(
        <>
            <Header clientInfo={clientInfo} />
            <ToolBox/>
            <Workspace/>
            <Footer/>
            {show_tour && <Tour/>}
            </>
    )
}
export default Main;
