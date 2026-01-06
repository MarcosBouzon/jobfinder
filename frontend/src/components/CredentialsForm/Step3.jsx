import Typography from "@mui/material/Typography";
import SlideFooter from "./SlideFooter";
import Grid from "@mui/material/Unstable_Grid2";
import step3ImgMozilla from "../../assets/step3-mozilla.webp";
import step3ImgChrome from "../../assets/step3-chrome.webp";
import mozilla from "../../assets/Mozilla-small.webp";
import chrome from "../../assets/chrome-small.png";
import { StepContentPaper, StepImage, StepFooter, IconImage } from "../styled/StyledComponents";

const Step3 = (props) => {
  return (
    <Grid container justifyContent="center">
      <Grid xs={10}>
        <StepContentPaper elevation={3}>
          <Typography variant="h4" sx={{ width: "100%", margin: "1rem 0" }}>
            Inspect page
          </Typography>
          <Typography variant="body1" sx={{ width: "100%", marginBottom: "2rem" }}>
            Once you click on `Inspect` the developers tools panel opens. The
            goal here is to go to cookies and get the three ones that we need.
          </Typography>

          {/* Firefox */}
          <Grid container xs={6}>
            <Grid xs={8} sx={{ padding: ".5rem" }}>
              <StepImage
                src={step3ImgMozilla}
                alt="Dev tools Firefox"
              />
            </Grid>
            <Grid xs={4} sx={{ padding: ".5rem", alignContent: "center" }}>
              <Typography variant="body1" sx={{ width: "100%" }}>
                Using Firefox
                <IconImage src={mozilla} alt="Firefox icon" />
              </Typography>
              <br />
              <Typography variant="body1" sx={{ width: "100%" }}>
                1- Click on the two right arrows at the top of the developer
                tools section.
              </Typography>
              <Typography variant="body1" sx={{ width: "100%" }}>
                2- Click on 'Storage'
              </Typography>
            </Grid>
          </Grid>

          {/* Chrome */}
          <Grid container xs={6}>
            <Grid xs={8} sx={{ padding: ".5rem" }}>
              <StepImage
                src={step3ImgChrome}
                alt="Dev tools Firefox"
              />
            </Grid>
            <Grid xs={4} sx={{ padding: ".5rem", alignContent: "center" }}>
              <Typography variant="body1" sx={{ width: "100%" }}>
                Using Chrome
                <IconImage src={chrome} alt="Chrome icon" />
              </Typography>
              <br />
              <Typography variant="body1" sx={{ width: "100%" }}>
                1- Click on the two right arrows at the top of the developer
                tools section.
              </Typography>
              <Typography variant="body1" sx={{ width: "100%" }}>
                2- Click on 'Application'
              </Typography>
            </Grid>
          </Grid>

          <StepFooter>
            <SlideFooter {...props} />
          </StepFooter>
        </StepContentPaper>
      </Grid>
    </Grid>
  );
};

export default Step3;
