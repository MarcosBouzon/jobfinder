import Typography from "@mui/material/Typography";
import SlideFooter from "./SlideFooter";
import Grid from "@mui/material/Unstable_Grid2";
import step2Img from "../../assets/step2.webp";
import { StepContentPaper, StepImage, StepFooter } from "../styled/StyledComponents";

const Step2 = (props) => {
  return (
    <Grid container justifyContent="center">
      <Grid xs={8}>
        <StepContentPaper elevation={3}>
          <Typography variant="h4" sx={{ width: "100%" }}>
            Open LinkedIn
          </Typography>
          <Grid xs={8} sx={{ padding: "1rem 2rem" }}>
            <StepImage
              src={step2Img}
              alt="LinkedIn image"
            />
          </Grid>
          <Grid xs={4} sx={{ padding: "1rem 0" }}>
            <Typography variant="body1" sx={{ width: "100%" }}>
              Ok, let's start getting the information needed from LinkedIn in
              order to be able to communicate with LinkedIn's API.
            </Typography>
            <br />
            <Typography variant="body1">
              LinkedIn uses an API called Voyager to fetch the information
              requested by the user. In order to communicate with Voyager,
              LinkedIn saves your information in cookies so they can be retrieved
              later and access Voyager in a faster way. Your goal now is to get
              those three cookies so we can also communicate with Voyager.
            </Typography>
            <br />
            <Typography variant="body1">
              To start, just open LinkedIn and on the current page, right click
              anywhere and then click on `Inspect` on the now opened menu.
            </Typography>
          </Grid>
          <StepFooter>
            <SlideFooter {...props} />
          </StepFooter>
        </StepContentPaper>
      </Grid>
    </Grid>
  );
};

export default Step2;
