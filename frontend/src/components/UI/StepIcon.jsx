import { StepIcon } from "@mui/material";
import { styled } from "@mui/system";


const JfStepIcon = styled(({ className, ...props }) => (
  <StepIcon className={className} {...props} />
))(({ theme }) => {
  return {
    color: "#004d4094",
    "&.Mui-active": {
      color: "#004d40"
    },
    "&.Mui-completed": {
      color: "#004d40"
    }
  };
});

export default JfStepIcon;
