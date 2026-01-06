import Typography from "@mui/material/Typography";
import SlideFooter from "./SlideFooter";
import Grid from "@mui/material/Unstable_Grid2";
import step5ImgMozilla from "../../assets/step5.webp";
import InputField from "../UI/InputField";
import { StepContentPaper, StepImage, StepFooter, CookieInput } from "../styled/StyledComponents";
import { useEffect, useState } from "react";
import {
  useSaveSettingsMutation,
  useGetSettingsQuery,
} from "../../features/api/apiSlice";
import { useDispatch } from "react-redux";
import { createNotification } from "../../store/notifications";

const Step5 = (props) => {
  const [liat, setLiat] = useState();
  const [lirm, setLirm] = useState();
  const [saveSettings, { isSuccess: isSaveSuccess, isError: isSaveError }] =
    useSaveSettingsMutation();
  const { data, isSuccess } = useGetSettingsQuery();
  const dispatch = useDispatch();
  let disableNext = true;

  try {
    if (liat && lirm) {
      disableNext = false;
    }
  } catch {} // error when gettin settings from server, do nothing.

  const handleNext = () => {
    const form = new FormData();
    form.append("li_at", liat ? liat : data.li_at);
    form.append("li_rm", lirm ? lirm : data.li_rm);
    saveSettings(form);
  };

  const handleLiatChange = (e) => {
    setLiat(e.target.value);
  };
  const handleLirmChange = (e) => {
    setLirm(e.target.value);
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
            Get Credentials -- part 2
          </Typography>

          <Grid xs={8} sx={{ padding: ".5rem" }}>
            <StepImage
              src={step5ImgMozilla}
              alt="Dev tools Firefox"
            />
          </Grid>

          <Grid xs={4} sx={{ padding: ".5rem", alignContent: "center" }}>
            <Typography variant="body1" sx={{ width: "100%" }}>
              Let's do the same now for the last two credentials (li_at, li_rm).
              This time we only need the credential values, not including the
              Expires value.
            </Typography>
            <br />
            <Typography variant="body1" sx={{ width: "100%" }}>
              1- Find 'li_at' in the cookies table, click on it, copy the row
              value and paste it as it is in the next input field.
            </Typography>
            <br />
            <CookieInput>
              <InputField
                id="li_at"
                name="li_at"
                type="text"
                label="li_at"
                placeholder="Insert value of li_at cookie here."
                validator={(value) => value.trim() !== ""}
                onChange={handleLiatChange}
                value={liat}
              />
            </CookieInput>
            <br />
            <Typography variant="body1" sx={{ width: "100%" }}>
              2- Find 'li_rm' in the cookies table, click on it, copy the row
              value and paste it as it is in the next input field.
            </Typography>
            <CookieInput>
              <InputField
                id="expires"
                name="expires"
                type="text"
                label="li_rm"
                placeholder="Insert value of li_rm here."
                validator={(value) => value.trim() !== ""}
                onChange={handleLirmChange}
                value={lirm}
              />
            </CookieInput>
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

export default Step5;
