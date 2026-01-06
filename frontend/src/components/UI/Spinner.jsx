import { CircularProgress } from "@mui/material";
import { SpinnerContainer } from "../styled/StyledComponents";

const Spinner = () => {
  return (
    <SpinnerContainer>
      <CircularProgress size={60} />
    </SpinnerContainer>
  );
};

export default Spinner;
