import SwitchButton from "../UI/SwitchButton";
import { Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { SettingControl } from "../styled/StyledComponents";
import LightGreenTooltip from "../UI/Tooltip";

const Setting = (props) => {
  const labelClickHandler = (e) => {
    e.preventDefault();
  };

  return (
    <SettingControl>
      <Typography
        component="label"
        htmlFor={props.id}
        onClick={labelClickHandler}
        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
      >
        {props.label}
        <LightGreenTooltip title={props.description}>
          <HelpOutlineIcon
            fontSize="small"
            sx={{ cursor: "help", fontSize: "16px" }}
          />
        </LightGreenTooltip>
      </Typography>
      <SwitchButton
        id={props.id}
        name={props.name}
        onChange={props.onChange}
        value={props.value}
      />
    </SettingControl>
  );
};

export default Setting;
