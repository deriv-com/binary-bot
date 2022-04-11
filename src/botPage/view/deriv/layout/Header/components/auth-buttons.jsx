import React, { useEffect } from "react";
import { translate } from "Translate";
// import { saveBeforeUnload } from "BlocklyPath/utils";
import { getOAuthURL } from "Common/appId";
import { useDispatch } from "react-redux";
import { setIsHeaderLoaded } from "Store/ui-slice";
// import Tour, { TourTargets } from "Components/tour";
import { getRelatedDeriveOrigin } from "../../../utils";

const AuthButtons = () => {
  const dispatch = useDispatch();

  const onLogin = () => {
    // saveBeforeUnload();
    document.location = getOAuthURL();
  };

  useEffect(() => {
    dispatch(setIsHeaderLoaded(true));
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
      >
        {translate("Sign up")}
      </a>
      {/* <TourTargets />
      <Tour /> */}
    </div>
  );
};

export default AuthButtons;