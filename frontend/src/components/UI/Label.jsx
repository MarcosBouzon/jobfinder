import { Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { StyledTooltip, GroupLabel } from "../styled/StyledComponents";

/**
 * Generic Label component. Accepts the following arguments:
 * - label (string): label title.
 * - description (string): a description for this label, that will be shown as a tooltip.
 */
const Label = (props) => {
  return (
    <GroupLabel>
      {props.label}
      {props.description && (
        <StyledTooltip title={props.description}>
          <HelpOutlineIcon fontSize="small" />
        </StyledTooltip>
      )}
    </GroupLabel>
  );
};

export default Label;
