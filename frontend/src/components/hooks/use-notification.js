import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideNotification } from "../../store/notifications";

const useNotification = (id) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [pointerInElement, setPointerInElement] = useState(false);
  const dispatch = useDispatch();

  let endAnimationTimeout;

  // end animation
  useEffect(() => {
    if (pointerInElement) {
      return;
    }

    if (isVisible && !hidden) {
      endAnimationTimeout = setTimeout(() => {
        setIsVisible(false);

        // hide element
        setTimeout(() => {
          // setIsHidding(false);
          setHidden(true);

          // notify element status
          dispatch(hideNotification(id));
        }, 300);
      }, 3000);
    }
  }, [isVisible, pointerInElement]);

  const pointerEnterHandler = () => {
    clearTimeout(endAnimationTimeout);
    setIsVisible(true);
    setPointerInElement(true);
  };
  const pointerLeaveHandler = () => {
    setPointerInElement(false);
  };
  const closeHandler = () => {
    setIsVisible(false);
    setHidden(true);
    clearTimeout(endAnimationTimeout);
    dispatch(hideNotification(id));
  };

  return [
    isVisible,
    hidden,
    pointerEnterHandler,
    pointerLeaveHandler,
    closeHandler,
  ];
};

export default useNotification;
