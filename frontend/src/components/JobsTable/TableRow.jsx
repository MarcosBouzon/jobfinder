import { useState } from "react";
import {
  useMarkAppliedMutation,
  useMarkDeletedMutation,
  useMarkSeenMutation,
} from "../../features/api/apiSlice";
import { createNotification } from "../../store/notifications";
import { useDispatch } from "react-redux";
import classes from "./TableRow.module.css";
import LightGreenTooltip from "../UI/Tooltip";

const TableRow = ({ job, index, forApplied, onPopJob: popJob }) => {
  const [markSeen] = useMarkSeenMutation();
  const [markApplied] = useMarkAppliedMutation();
  const [markDeleted] = useMarkDeletedMutation();
  const dispatch = useDispatch();

  const markSeenHandler = async () => {
    try {
      await markSeen(job.id);
    } catch (error) {}
  };

  const markAppliedHandler = async () => {
    try {
      await markApplied(job.id);
      dispatch(
        createNotification({
          title: "Applied",
          message: `Got it, you have applied for this job!`,
        })
      );
    } catch (error) {
      dispatch(
        createNotification({
          title: "Error",
          message: `Ohhh boy. An error ocurred when applied for this job, please try again!`,
          error: true,
        })
      );
    }
  };

  const markDeletedHandler = async () => {
    try {
      await markDeleted(job.id);
      dispatch(
        createNotification({
          title: "Deleted",
          message: `Job: ${job.title.slice(0, 20)}... has been deleted`,
          jobDeleted: true,
          jobId: job.id,
        })
      );
    } catch (error) {
      dispatch(
        createNotification({
          title: "Error",
          message: `An error ocurred when deleting this job, please try again.`,
          error: true,
        })
      );
    }
  };

  const goToPageHandler = () => {
    window.open(job.link, "_blank");
    markSeenHandler();
  };

  return (
    <tr className={classes["job-row"]}>
      <td>
        {forApplied ? (
          index
        ) : job.seen ? (
          <span className="material-symbols-sharp">visibility</span>
        ) : (
          index
        )}
      </td>
      <td style={{ width: "40rem", overflow: "hidden" }}>{job.title}</td>
      <td style={{ width: "10rem", overflow: "hidden" }}>{job.salary}</td>
      <td style={{ width: "25rem", overflow: "hidden" }}>{job.company}</td>
      <td style={{ width: "7rem", overflow: "hidden" }}>{job.applied_date}</td>
      <td>{job.platform}</td>
      <td className={classes["actions-wrapper"]}>
        {!forApplied && (
          <LightGreenTooltip
            enterDelay={1000}
            enterTouchDelay={1000}
            title="Mark as applied"
            disableInteractive={true}
            enterNextDelay={1000}
          >
            <span
              className="material-symbols-sharp action-check"
              data-bs-toggle="tooltip"
              data-bs-title="Mark a job as applied"
              onClick={markAppliedHandler}
            >
              check_box
            </span>
          </LightGreenTooltip>
        )}
        <LightGreenTooltip
          enterDelay={1000}
          enterTouchDelay={1000}
          title="Open job"
          disableInteractive={true}
          enterNextDelay={1000}
        >
          <span
            className="material-symbols-sharp action-open"
            data-bs-toggle="tooltip"
            data-bs-title="Go to job page"
            onClick={goToPageHandler}
          >
            open_in_new
          </span>
        </LightGreenTooltip>
        <LightGreenTooltip
          enterDelay={1000}
          enterTouchDelay={1000}
          title="Delete job"
          disableInteractive={true}
          enterNextDelay={1000}
        >
          <span
            className="material-symbols-sharp action-delete"
            data-bs-toggle="tooltip"
            data-bs-title="Delete job"
            onClick={markDeletedHandler}
          >
            delete
          </span>
        </LightGreenTooltip>
      </td>
    </tr>
  );
};

export default TableRow;
