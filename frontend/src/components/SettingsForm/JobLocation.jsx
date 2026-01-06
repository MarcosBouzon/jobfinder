import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
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

  return (
    <FormControl>
      <FormGroup aria-label="job location" row>
        <FormControlLabel
          control={
            <Checkbox
              id="onsite"
              name="onsite"
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
