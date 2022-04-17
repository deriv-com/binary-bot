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
    if(resizeable && isDesktop()){
      const modal = modal_container_ref.current;
      const resizer = modal.querySelector(".modal__resize");
      function Resize(e) {
        modal.style.width = e.clientX - modal.offsetLeft + "px";
        modal.style.height = e.clientY - modal.offsetTop + "px";
      }
      function initResize(e) {
        window.addEventListener("mousemove", Resize, false);
        window.addEventListener("mouseup", stopResize, false);
      }

      resizer.addEventListener("mousedown", initResize, false);
  
      function stopResize(e) {
        window.removeEventListener("mousemove", Resize, false);
        window.removeEventListener("mouseup", stopResize, false);
      }
    }
    
    return () => {
      window.removeEventListener("click", handleModalClickOutside);
    };
  }, []);

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
