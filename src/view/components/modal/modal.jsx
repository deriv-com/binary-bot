import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {isDesktop} from 'Tools';

const Modal = ({
  children,
  title,
  onClose,
  action,
  class_name,
  resizeable,
}) => {
  const modal_ref = React.useRef();
  const modal_container_ref = React.useRef();

  React.useEffect(() => {
    function handleModalClickOutside(event) {
      if (modal_container_ref.current) {
        if (!modal_container_ref.current.contains(event.target)) {
          onClose();
        }
      }
      window.addEventListener("click", handleModalClickOutside);
    }
    const modal = modal_container_ref.current;
    const modal_wrapper = modal_ref.current; 
    if(resizeable && isDesktop()){
      const resizer = modal.querySelector(".modal__resize");
      function Resize(e) {
        modal.style.width = e.clientX - modal_wrapper.offsetLeft + "px";
        modal.style.height = e.clientY - modal_wrapper.offsetTop + "px";
      }

      function stopResize(e) {
        window.removeEventListener("mousedown", initResize);
        window.removeEventListener("mousemove", Resize);
        window.removeEventListener("mouseup", stopResize)
        window.removeEventListener("click",stopResize)

      }

      function initResize() {
        window.addEventListener("mousemove", Resize);
        window.addEventListener("mouseup", stopResize);
      }

      resizer.addEventListener("mousedown", initResize);

    }
    function dragModal(e){
      modal_wrapper.style.top = `${e.clientY -  modal.offsetTop}px`
      modal_wrapper.style.left = `${e.clientX - modal.offsetLeft}px`
    }

    function dragModalAction(e){
      window.addEventListener("mousemove",dragModal)
    }
    function removedragModalAction(){
      window.removeEventListener("mousemove",dragModal)
      window.removeEventListener("mousedown", dragModalAction);
      window.removeEventListener("mouseup",removedragModalAction)
      window.removeEventListener("click",removedragModalAction)
    }
    if(isDesktop()){
      const header = modal.querySelector('.modal__header');
      header.addEventListener("mousedown",dragModalAction);
      window.addEventListener("mouseup", removedragModalAction)
      window.addEventListener("click",removedragModalAction)
    }
    
    return () => {
      window.removeEventListener("click", handleModalClickOutside);
    };
  },[]);

  return (
    <div
      className={classNames("modal", class_name && `modal-${class_name}`)}
      ref={modal_ref}
    >
      <div className="modal__container" ref={modal_container_ref}>
        <div className="modal__header">
          <div className="modal__header-title">{title}</div>
          <div className="modal__header-right">
            <div className="modal__header-right-action">{action}</div>
            <button className="modal__header-right-close" onClick={onClose} />
          </div>
        </div>
        <div className="modal__content">{children}</div>
        {resizeable && isDesktop() && (
          <div className="modal__resize">
            <div className="modal__resize-icon modal__resize-nw"></div>
            <div className="modal__resize-icon modal__resize-e"></div>
            <div className="modal__resize-icon modal__resize-s"></div>
            <div className="modal__resize-icon modal__resize-se"></div>
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  action: PropTypes.any,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  class_name: PropTypes.string,
  onClose: PropTypes.func,
  title: PropTypes.string,
};

export default Modal;
