import SwitchButton from "../UI/SwitchButton";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import classes from "./Setting.module.css";

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
 * Custom switch button setting including a label. Accepts the following props:
 * - className (string): Additional class names
 * - id (string): Given id for the input.
 * - name (string): Given name for the input.
 * - label (string): Optional label for the input.
 * - description (string): Setting description for the user.
 * - onChange (func): Optional function to execute when the onChange event gets triggered.
 * @returns JSX
 */
const Setting = (props) => {
  const labelClickHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className={`${classes.control} ${classes["control-small"]} ${props.className}`}
    >
      <label htmlFor={props.id} onClick={labelClickHandler}>
        {props.label}
        <LightGreenTooltip title={props.description}>
          <span className={`material-symbols-sharp  ${classes.learn}`}>
            error
          </span>
        </LightGreenTooltip>
      </label>
      <SwitchButton
        id={props.id}
        name={props.name}
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
};

export default Setting;
