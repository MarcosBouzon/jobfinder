import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";

const JobLocation = (props) => {
  const [remote, setRemote] = useState(props.remote);
  const [onSite, setOnSite] = useState(props.onSite);
  const [hybrid, setHybrid] = useState(props.hybrid);

  const remoteCheckHandler = () => {
    setRemote((prevState) => !prevState);
  };
  const onSiteCheckHandler = () => {
    setOnSite((prevState) => !prevState);
  };
  const hybridCheckHandler = () => {
    setHybrid((prevState) => !prevState);
  };

  const color = {
    color: "#004d40",
    "&.Mui-checked": {
      color: "#004d40",
    },
  };
  return (
    <FormControl>
      <FormGroup aria-label="job location" row>
        <FormControlLabel
          control={
            <Checkbox
              id="onsite"
              name="onsite"
              sx={color}
              checked={onSite}
              onChange={onSiteCheckHandler}
            />
          }
          label="On-Site"
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="hybrid"
              name="hybrid"
              sx={color}
              checked={hybrid}
              onChange={hybridCheckHandler}
            />
          }
          label="Hybrid"
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="remote"
              name="remote"
              sx={color}
              checked={remote}
              onChange={remoteCheckHandler}
            />
          }
          label="Remote"
          labelPlacement="start"
        />
      </FormGroup>
    </FormControl>
  );
};

export default JobLocation;
