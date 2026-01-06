import Typography from "@mui/material/Typography";
import SlideFooter from "./SlideFooter";
import Grid from "@mui/material/Unstable_Grid2";
import step4ImgMozilla from "../../assets/step4.webp";
import InputField from "../UI/InputField";
import { StepContentPaper, StepImage, StepFooter, CookieInput } from "../styled/StyledComponents";
import { useEffect, useState } from "react";
import {
  useSaveSettingsMutation,
  useGetSettingsQuery,
} from "../../features/api/apiSlice";
import { useDispatch } from "react-redux";
import { createNotification } from "../../store/notifications";

const Step4 = (props) => {
  const [jsession, setJsession] = useState();
  const [expires, setExpires] = useState();
  const [saveSettings, { isSuccess: isSaveSuccess, isError: isSaveError }] =
    useSaveSettingsMutation();
  const { data, isSuccess } = useGetSettingsQuery();
  const dispatch = useDispatch();
  let disableNext = true;

  try {
    if ((jsession || data.jsessionid) && (expires || data.session_expires)) {
      disableNext = false;
    }
  } catch {} // error when gettin settings from server, do nothing.

  const handleNext = () => {
    const form = new FormData();
    form.append("jsessionid", jsession ? jsession : data.jsessionid);
    form.append("session_expires", expires ? expires : data.session_expires);
    saveSettings(form);
  };

  const handleJsessionChange = (e) => {
    setJsession(e.target.value);
  };
  const handleExpiresChange = (e) => {
    setExpires(e.target.value);
  };

  useEffect(() => {
    if (isSaveError) {
      dispatch(
        createNotification({
          title: "Failed",
          message:
            "An error ocurred when saving your settings, reload the page and try again!",
          error: true,
        })
      );
    }
    if (isSaveSuccess) {
      props.handleNext();
    }
  }, [isSaveError, isSaveSuccess]);

  return (
    <Grid container justifyContent="center">
      <Grid xs={10}>
        <StepContentPaper elevation={3}>
          <Typography variant="h4" sx={{ width: "100%", margin: "1rem 0" }}>
            Get Credentials
          </Typography>

          <Grid xs={8} sx={{ padding: ".5rem" }}>
            <StepImage
              src={step4ImgMozilla}
              alt="Dev tools Firefox"
            />
          </Grid>

          <Grid xs={4} sx={{ padding: ".5rem", alignContent: "center" }}>
            <Typography variant="body1" sx={{ width: "100%" }}>
              1- Either using Firefox or Chrome, go to cookies now. In Firefox
              can be found in the developer tools in the top menu, and in
              Chrome, inside the developer tools, in the left menu.
            </Typography>
            <br />
            <Typography variant="body1" sx={{ width: "100%" }}>
              2- Once in the cookies section, we need to find a cookie called
              JSESSIONID. Click on the cookie row once you localize it on the
              table.
            </Typography>
            <br />
            <Grid xs={12}>
              <Typography variant="body1" sx={{ width: "100%" }}>
                3- In the cookie details section, right click on the first row
                as in the picture and copy the row value. Paste the copied value
                in the following input field. Paste the value as it is, don't
                modify it.
              </Typography>
              <CookieInput>
                <InputField
                  id="jsessionid"
                  name="jsessionid"
                  type="text"
                  placeholder="Insert value of JSESSIONID cookie here."
                  validator={(value) => value.trim() !== ""}
                  onChange={handleJsessionChange}
                  value={isSuccess ? data.jsessionid : ""}
                />
              </CookieInput>
            </Grid>
            <br />
            <Grid xs={12}>
              <Typography variant="body1" sx={{ width: "100%" }}>
                4- Repeat the same steps as in number three, but this time for
                the 'Expires' field as in the picture. Once you have copied the
                value of the Expires row, paste the value in the following input
                field. Paste the value as it is, don't modify it.
              </Typography>
              <CookieInput>
                <InputField
                  id="expires"
                  name="expires"
                  type="text"
                  placeholder="Insert value of Expires here."
                  validator={(value) => value.trim() !== ""}
                  onChange={handleExpiresChange}
                  value={isSuccess ? data.session_expires : ""}
                />
              </CookieInput>
            </Grid>
          </Grid>

          <StepFooter>
            <SlideFooter
              {...props}
              disableNext={disableNext}
              handleNext={handleNext}
            />
          </StepFooter>
        </StepContentPaper>
      </Grid>
    </Grid>
  );
};

export default Step4;
