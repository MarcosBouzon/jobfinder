import classes from "./CredentialsForm.module.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import JfStepIcon from "../UI/StepIcon";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import { useState } from "react";

const steps = [
  "Welcome",
  "Open LinkedIn",
  "Inspect page",
  "Get credentials - 1",
  "Get credentials - 2",
];

const stepSlides = [Step1, Step2, Step3, Step4, Step5];

const CredentialsForm = (props) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setActiveStep(0);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const StepSlide = stepSlides[activeStep];

  return (
    <div className={classes["stepper-wrapper"]}>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps = {};
            const labelProps = {
              StepIconComponent: JfStepIcon,
            };
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <StepSlide
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            isLast={activeStep === steps.length - 1}
          />
        </>
      </Box>
    </div>
  );
};

export default CredentialsForm;
