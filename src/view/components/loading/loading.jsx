import React from "react";
import classNames from "classnames";

const Loading = ({ white, type="" }) => (
  <div className= {classNames("barspinner__wrapper",{[`barspinner__wrapper-${type}`]: type})}>
    <div className={classNames("barspinner", { "barspinner-white": white })}>
      <div className="rect1"></div>
      <div className="rect2"></div>
      <div className="rect3"></div>
      <div className="rect4"></div>
      <div className="rect5"></div>
    </div>
  </div>
);

export default Loading;
