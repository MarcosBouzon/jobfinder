import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import sharedClasses from "./SharedClasses.module.css";
import SlideFooter from "./SlideFooter";
import Grid from "@mui/material/Unstable_Grid2";
import step3ImgMozilla from "../../assets/step3-mozilla.webp";
import step3ImgChrome from "../../assets/step3-chrome.webp";
import mozilla from "../../assets/Mozilla-small.webp";
import chrome from "../../assets/chrome-small.png";

const Step3 = (props) => {
  return (
    <Grid container justifyContent="center">
      <Grid xs={10}>
        <Paper
          elevation={3}
          className={sharedClasses.paper}
          sx={{
            boxShadow:
              "0px 5px 5px -3px rgba(0, 0, 0, 0.66),0px 8px 10px 1px rgba(0, 0, 0, 0.12),0px 3px 14px 2px rgba(0, 0, 0, 0.15);",
          }}
        >
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
              <img
                src={step3ImgMozilla}
                alt="Dev tools Firefox"
                className={sharedClasses["step-image"]}
              />
            </Grid>
            <Grid xs={4} sx={{ padding: ".5rem", alignContent: "center" }}>
              <Typography variant="body1" sx={{ width: "100%" }}>
                Using Firefox
                <img src={mozilla} alt="Firefox icon" className={sharedClasses["icon-img"]} />
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
              <img
                src={step3ImgChrome}
                alt="Dev tools Firefox"
                className={sharedClasses["step-image"]}
              />
            </Grid>
            <Grid xs={4} sx={{ padding: ".5rem", alignContent: "center" }}>
              <Typography variant="body1" sx={{ width: "100%" }}>
                Using Chrome
                <img src={chrome} alt="Chrome icon" className={sharedClasses["icon-img"]} />
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

          <div className={sharedClasses["footer-wrapper"]}>
            <SlideFooter {...props} />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Step3;
