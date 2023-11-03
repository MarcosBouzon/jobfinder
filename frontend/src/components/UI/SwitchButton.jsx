import { alpha, styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useState } from "react";

const StyleSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#004d40",
    "&:hover": {
      backgroundColor: alpha("#004d40", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#004d40",
  },
}));

const SwitchButton = (props) => {
  const [checked, setChecked] = useState(props.value);

  const changeHandler = () => {
    setChecked(!checked);
  };

  return (
    <StyleSwitch
      id={props.id}
      name={props.name}
      onChange={props.onChange !== undefined ? props.onChange : changeHandler}
      checked={checked}
    />
  );
};

export default SwitchButton;
