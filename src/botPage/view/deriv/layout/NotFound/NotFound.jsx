import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setShowLoading } from '../../store/ui-slice';
const NotFound = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setShowLoading(false));
  }, [])
  
  return (
    <div className="page-not-found">
      <div className="page-not-found__inner">
        <p>The page you are looking for does not exist.</p>
        <p>Are you lost? Click <Link to="/">here</Link></p>
      </div>
    </div>
  )
}
export default NotFound;
