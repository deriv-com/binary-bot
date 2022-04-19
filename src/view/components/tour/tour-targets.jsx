import React from 'react';
import ReactDOM from 'react-dom'
import { useSelector } from "react-redux";

const FirstStepTarget = () => (<div
    style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }}
    id='first-step-target'
/>);

const SecontStepTarget = () => (<div
    style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }}
    id='second-step-target'
/>);

const ThirdStepTarget = () => {
    const style = {top: '23%', left: "10%",  position:'absolute'}
    const tour_target = document.getElementsByClassName('blocklyTreeRoot')[0];
    return createReactNode("third-step-target", style, tour_target);
};


const ForthStepTarget = ({ tour_target }) => {
    const { is_logged } = useSelector((state) => state.client);
    const style = {top: '50px', left: is_logged ? "84%" : "90%",  position:'absolute'}
    return createReactNode(
      "forth-step-target",
      style,
      tour_target
    );
  };
  
  function createReactNode(id, style, tour_target) {
    const new_account_position = React.createElement("div", { id, style });
    return tour_target && ReactDOM.createPortal(new_account_position, tour_target) || null;
  }
  

  const TourTargets = ({ tour_target }) => (
    <div>
      <FirstStepTarget />
      <SecontStepTarget />
      <ThirdStepTarget />
      <ForthStepTarget tour_target={tour_target} />
    </div>
  );

export default TourTargets;