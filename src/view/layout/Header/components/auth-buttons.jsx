import React, { useEffect } from "react";
import { translate } from "Translate";
// import { saveBeforeUnload } from "BlocklyPath/utils";
import { getOAuthURL } from "Common/appId";
import { useDispatch } from "react-redux";
import { setIsHeaderLoaded } from "Store/ui-slice";
import { getRelatedDeriveOrigin } from "Shared/utils";

const AuthButtons = ({ getTourTarget }) => {
  const dispatch = useDispatch();
  const onLogin = () => {
    // saveBeforeUnload();
    document.location = getOAuthURL();
  };

  const ref = React.useRef();

  useEffect(() => {
    dispatch(setIsHeaderLoaded(true));
    getTourTarget(ref.current);

  }, []);

  return (
    <div className="header__btn">
      <button
        id="btn__login"
        className="btn btn--tertiary header__btn-login"
        onClick={onLogin}
      >
        {translate("Log in")}
      </button>
      <a
        id="btn__signup"
        className="btn btn--primary header__btn-signup"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://deriv.${getRelatedDeriveOrigin().extension}/signup/`}
        ref={ref}
      >
        {translate("Sign up")}
      </a>
    </div>
  );
};

export default AuthButtons;
