import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";

const SlideFooter = (props) => {

  return (
    <Box>
      <Button
        color="inherit"
        disabled={props.activeStep === 0}
        onClick={props.handleBack}
        sx={{ mr: 1, color: "#FFFF", border: "1px solid #FFFF" }}
      >
        Back
      </Button>

      <Button
        onClick={props.handleNext}
        disabled={props.disableNext !== undefined ? props.disableNext : false}
        sx={{
          color: "#FFFF",
          border: "1px solid #FFFF",
          "&:hover": { backgroundColor: "#004d4010" },
        }}
      >
        {props.isLast ? "Finish" : "Next"}
      </Button>
    </Box>
  );
};

export default SlideFooter;
