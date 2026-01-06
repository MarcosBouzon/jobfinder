import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const SlideFooter = (props) => {

  return (
    <Box>
      <Button
        variant="outlined"
        color="inherit"
        disabled={props.activeStep === 0}
        onClick={props.handleBack}
        sx={{ mr: 1 }}
      >
        Back
      </Button>

      <Button
        variant="outlined"
        color="inherit"
        onClick={props.handleNext}
        disabled={props.disableNext !== undefined ? props.disableNext : false}
      >
        {props.isLast ? "Finish" : "Next"}
      </Button>
    </Box>
  );
};

export default SlideFooter;
