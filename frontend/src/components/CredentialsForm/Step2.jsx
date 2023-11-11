import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import sharedClasses from "./SharedClasses.module.css";
import SlideFooter from "./SlideFooter";
import Grid from "@mui/material/Unstable_Grid2";
import step2Img from "../../assets/step2.webp";

const Step2 = (props) => {
  return (
    <Grid container justifyContent="center">
      <Grid xs={8}>
        <Paper
          elevation={3}
          className={sharedClasses.paper}
          sx={{
            boxShadow:
              "0px 5px 5px -3px rgba(0, 0, 0, 0.66),0px 8px 10px 1px rgba(0, 0, 0, 0.12),0px 3px 14px 2px rgba(0, 0, 0, 0.15);",
          }}
        >
          <Typography variant="h4" sx={{ width: "100%" }}>
            Open LinkedIn
          </Typography>
          <Grid xs={8} sx={{ padding: "1rem 2rem" }}>
            <img
              src={step2Img}
              alt="LinkedIn image"
              className={sharedClasses["step-image"]}
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
          <div className={sharedClasses["footer-wrapper"]}>
            <SlideFooter {...props} />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Step2;
