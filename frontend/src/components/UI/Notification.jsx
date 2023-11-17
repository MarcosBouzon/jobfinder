import { useEffect, useState } from "react";
import { hideNotification } from "../../store/notifications";
import { useDispatch } from "react-redux";
import { useUndeleteJobMutation } from "../../features/api/apiSlice";
import classes from "./Notification.module.css";
import useNotification from "../hooks/use-notification";

const Notification = ({
  id,
  title,
  message,
  jobId,
  jobDeleted,
  success,
  warning,
  error,
}) => {
  const [
    notifIsVisible,
    notifIsHidden,
    pointerEnterHandler,
    pointerLeaveHandler,
    closeHandler,
  ] = useNotification(id);
  const [undeleteJob] = useUndeleteJobMutation();

  let notiClasses = `${classes.notification} `;
  if (notifIsVisible) {
    notiClasses = `${classes.notification} ${classes.show} `;
  }
  if (notifIsHidden) {
    notiClasses = `${classes.notification} ${classes.hidden}`;
  }

  let typeClasses = `${classes["type-wrapper"]} `;
  if (success) {
    typeClasses += `${classes["bg-success"]}`;
  } else if (warning) {
    typeClasses += `${classes["bg-warning"]}`;
  } else if (error) {
    typeClasses += `${classes["bg-error"]}`;
  }

  const undeleteHanlder = () => {
    closeHandler();
    undeleteJob(jobId);
  };

  return (
    <div
      className={notiClasses}
      onPointerEnter={pointerEnterHandler}
      onPointerLeave={pointerLeaveHandler}
    >
      <div className={typeClasses}>
        {success && (
          <span className="material-symbols-sharp">check_circle</span>
        )}
        {warning && <span className="material-symbols-sharp">warning</span>}
        {error && <span className="material-symbols-sharp">error</span>}
      </div>
      <div className={classes.content}>
        <div className={classes.close}>
          <span className="material-symbols-sharp" onClick={closeHandler}>
            close
          </span>
        </div>
        <h5>{title}</h5>
        <p>{message}</p>
        <div className={classes.actions}>
          {jobDeleted && (
            <button onClick={undeleteHanlder}>
              <span className="material-symbols-sharp">undo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
