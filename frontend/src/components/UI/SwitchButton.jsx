import { Switch } from "@mui/material";
import { useState } from "react";

const SwitchButton = (props) => {
  const [checked, setChecked] = useState(props.value);

  const changeHandler = (e) => {
    setChecked(e.target.checked);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <Switch
      id={props.id}
      name={props.name}
      onChange={changeHandler}
      checked={checked}
    />
  );
};

export default SwitchButton;
