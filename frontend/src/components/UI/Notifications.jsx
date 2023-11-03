import { useSelector } from "react-redux";
import Notification from "./Notification";
import classes from "./Notifications.module.css";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { createNotification } from "../../store/notifications";
import { useDispatch } from "react-redux";

const socket = io("http://localhost:5100/", {
  cors: {
    origin: "http://localhost:5173/",
  },
});

const Notifications = (props) => {
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("notification", (message) => {
      dispatch(createNotification(JSON.parse(message)));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.notifications}>
        {notifications.map((noti) => {
          if (noti.visible) {
            return (
              <Notification
                key={noti.id}
                id={noti.id}
                title={noti.title}
                message={noti.message}
                jobDeleted={noti.jobDeleted}
                success={noti.success}
                warning={noti.warning}
                error={noti.error}
                jobId={noti.jobId}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Notifications;
