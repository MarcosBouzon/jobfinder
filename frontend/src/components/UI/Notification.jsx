import { IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import UndoIcon from "@mui/icons-material/Undo";
import { useUndeleteJobMutation } from "../../features/api/apiSlice";
import {
  NotificationPaper,
  NotificationSidebar,
  NotificationContent,
} from "../styled/StyledComponents";
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

  const variant = error ? "error" : warning ? "warning" : "success";

  const undeleteHanlder = () => {
    closeHandler();
    undeleteJob(jobId);
  };

  if (notifIsHidden) {
    return null;
  }

  return (
    <NotificationPaper
      visible={notifIsVisible}
      onPointerEnter={pointerEnterHandler}
      onPointerLeave={pointerLeaveHandler}
    >
      <NotificationSidebar variant={variant}>
        {success && <CheckCircleIcon />}
        {warning && <WarningIcon />}
        {error && <ErrorIcon />}
      </NotificationSidebar>
      <NotificationContent>
        <IconButton
          size="small"
          onClick={closeHandler}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <h5>{title}</h5>
        <p>{message}</p>
        {jobDeleted && (
          <IconButton
            size="small"
            onClick={undeleteHanlder}
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              color: "primary.main",
              borderRadius: 1,
              padding: "0.1rem 1rem",
              marginTop: "0.5rem",
            }}
          >
            <UndoIcon fontSize="small" />
          </IconButton>
        )}
      </NotificationContent>
    </NotificationPaper>
  );
};

export default Notification;
