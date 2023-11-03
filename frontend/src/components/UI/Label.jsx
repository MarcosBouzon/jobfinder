import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import classes from "./Label.module.css";

const LightGreenTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#004d40",
    color: theme.palette.common.white,
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

/**
 * Generic Label component. Accepts the following arguments:
 * - className (string): parent class names.
 * - label (string): label title.
 * - description (string): a description for this label, that will be shown as a tooltip.
 */
const Label = (props) => {
  return (
    <h4 className={props.className}>
      {props.label}
      {props.description && (
        <LightGreenTooltip title={props.description}>
          <span className={`material-symbols-sharp  ${classes.learn}`}>
            error
          </span>
        </LightGreenTooltip>
      )}
    </h4>
  );
};

export default Label;
