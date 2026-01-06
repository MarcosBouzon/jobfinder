import { useState } from "react";
import { TableCell, IconButton, Box } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  useMarkAppliedMutation,
  useMarkDeletedMutation,
  useMarkSeenMutation,
} from "../../features/api/apiSlice";
import { createNotification } from "../../store/notifications";
import { useDispatch } from "react-redux";
import { StyledTableRow } from "../styled/StyledComponents";
import LightGreenTooltip from "../UI/Tooltip";

const TableRow = ({ job, index, forApplied }) => {
  const [markSeen] = useMarkSeenMutation();
  const [markApplied] = useMarkAppliedMutation();
  const [markDeleted] = useMarkDeletedMutation();
  const dispatch = useDispatch();

  if (!job) {
    return null;
  }

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
    <StyledTableRow>
      <TableCell>
        {forApplied ? (
          index
        ) : job.seen ? (
          <VisibilityIcon fontSize="small" />
        ) : (
          index
        )}
      </TableCell>
      <TableCell sx={{ width: "40rem", overflow: "hidden" }}>
        {job.title}
      </TableCell>
      <TableCell sx={{ width: "10rem", overflow: "hidden" }}>
        {job.salary}
      </TableCell>
      <TableCell sx={{ width: "25rem", overflow: "hidden" }}>
        {job.company}
      </TableCell>
      <TableCell>{job.platform}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: '0.25rem' }}>
          {!forApplied && (
            <LightGreenTooltip
              enterDelay={1000}
              enterTouchDelay={1000}
              title="Mark as applied"
              disableInteractive={true}
              enterNextDelay={1000}
            >
              <IconButton size="small" onClick={markAppliedHandler}>
                <CheckBoxIcon fontSize="small" />
              </IconButton>
            </LightGreenTooltip>
          )}
          <LightGreenTooltip
            enterDelay={1000}
            enterTouchDelay={1000}
            title="Open job"
            disableInteractive={true}
            enterNextDelay={1000}
          >
            <IconButton size="small" onClick={goToPageHandler}>
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </LightGreenTooltip>
          <LightGreenTooltip
            enterDelay={1000}
            enterTouchDelay={1000}
            title="Delete job"
            disableInteractive={true}
            enterNextDelay={1000}
          >
            <IconButton size="small" onClick={markDeletedHandler}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </LightGreenTooltip>
        </Box>
      </TableCell>
    </StyledTableRow>
  );
};

export default TableRow;
