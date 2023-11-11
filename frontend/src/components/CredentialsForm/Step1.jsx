import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import sharedClasses from "./SharedClasses.module.css";
import SlideFooter from "./SlideFooter";
import Grid from "@mui/material/Unstable_Grid2";

const Step1 = (props) => {
  return (
    <Grid container justifyContent="center">
      <Grid xs={6}>
        <Paper
          elevation={8}
          className={sharedClasses.paper}
          sx={{
            boxShadow:
              "0px 5px 5px -3px rgba(0, 0, 0, 0.66),0px 8px 10px 1px rgba(0, 0, 0, 0.12),0px 3px 14px 2px rgba(0, 0, 0, 0.15);",
          }}
        >
          <Typography variant="h4" sx={{ width: "100%", margin: "1rem 0" }}>
            Welcome
          </Typography>
          <Typography variant="body1" sx={{ width: "100%" }}>
            Hi there job seeker, welcome to JobFinder.
          </Typography>
          <Typography variant="body1" sx={{ width: "100%" }}>
            This application will help you with your search for a new job.
            Finding jobs in LinkedIn is nice but sometimes can be a bit
            overwhelming. Why? Because Jobs search in LinkedIn is based on a
            title and then is up to us to search through all the results,
            wasting precious time that could be used in some other tasks.
          </Typography>
          <Typography variant="body1" sx={{ width: "100%" }}>
            Another case scenario is when you apply for a job. It's almost 100%
            sure that you are going to be contacted back by the recruiter three
            or four days later, if you are lucky. Then, by the time you are
            contacted by the recruiter, you probably have sent more than 50
            applications and you don't remember about the job, company, salary,
            or anything. With JobFinder searching for applied jobs takes less
            than a second, so now you know what the recruiter is talking about
            and the journey starts........
          </Typography>
          <div className={sharedClasses["footer-wrapper"]}>
            <SlideFooter {...props} />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Step1;
