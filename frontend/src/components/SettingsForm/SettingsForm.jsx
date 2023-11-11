import InputField from "../UI/InputField";
import Setting from "./Setting";
import Spinner from "../UI/Spinner";
import JobLocation from "./JobLocation";
import Label from "../UI/Label";
import { useSaveSettingsMutation } from "../../features/api/apiSlice";
import { createNotification } from "../../store/notifications";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import classes from "./SettingsForm.module.css";

const SettingsForm = ({ data, isLoading, isSuccess, isError }) => {
  const [saveSettings, { isSuccess: saveIsSuccess, isError: saveIsError }] =
    useSaveSettingsMutation();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    saveSettings(form);
  };

  useEffect(() => {
    if (saveIsSuccess) {
      dispatch(
        createNotification({
          title: "Saved",
          message: "Your settings have been saved!",
        })
      );
    }
    if (saveIsError) {
      dispatch(
        createNotification({
          title: "Error",
          message: "Your settings couldn't been saved!",
          error: true,
        })
      );
    }
  }, [saveIsSuccess, saveIsError]);

  useEffect(() => {
    if (isError) {
      dispatch(
        createNotification({
          title: "Loading Error",
          message:
            "An error ocurred when loading your saved settings. Please try again.",
          error: true,
        })
      );
    }
  }, [isError]);

  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <div className={classes["form-wrapper"]}>
          <form className={classes.form} onSubmit={submitHandler}>
            {/* Job title */}
            <div className={`${classes["control-group"]}`}>
              <Label
                className={classes["group-label"]}
                label="Job title:"
                description="Search for jobs which title is equal or similar to the value of this field."
              />
              <InputField
                className={`${classes.input} ${classes["input-lg"]}`}
                type="text"
                id="job-title"
                name="job-title"
                placeholder="Insert your job title search criteria here."
                value={data.job_title}
                validator={(value) => value.trim() != ""}
                errorMsg="This field can't be empty"
              />
            </div>

            {/* Job keywords */}
            <div className={`${classes["control-group"]}`}>
              <Label
                className={classes["group-label"]}
                label="Keywords"
                description="Keywords to match in the job description. Leave this field empty to match any job containing your job title. Add keywords comma separated to filter the job description. If any of the kewwords is present in the job description, then it will be a match and the job will be saved. e.g: If you want to get jobs for Frontend developer using React, insert Frontend developer in the job title field, and React in the keywords field."
              />
              <InputField
                className={`${classes.input} ${classes["input-lg"]}`}
                type="text"
                id="keywords"
                name="keywords"
                placeholder="Insert keywords to filter the job description."
                value={data.keywords}
              />
            </div>

            {/* Location */}
            <div className={`${classes["control-group"]} `}>
              <Label
                className={classes["group-label"]}
                label="Job location:"
                description="Search jobs filered by their workplace location"
              />
              <JobLocation
                remote={data.remote}
                onSite={data.on_site}
                hybrid={data.hybrid}
              />
            </div>

            {/* Other settings */}
            <div className={classes["control-group"]}>
              <Label
                className={classes["group-label"]}
                label="Other settings:"
                description=""
              />
              <Setting
                id="night-search"
                name="night-search"
                label="Night search enabled"
                description="Allows searching for new jobs during night time (8pm - 6am). Jobs posted during the night, might have many applicants when you wake up in the morning. This setting may not be convenient if you are looking for jobs with fewer applicants."
                value={data.night_search}
              />
              <Setting
                id="weekend-search"
                name="weekend-search"
                label="Weekend search enabled"
                description="Allows searching for new jobs on weekends. You may consider not enabling this setting if you don't check for new jobs on weekends, as when you come back on Monday, all the jobs found during the weekend might have a lot of applicants."
                value={data.weekend_search}
              />
              <Setting
                id="delete-old"
                name="delete-old"
                label="Delete old jobs"
                description="Automatically delete jobs older than 24 hours."
                value={data.delete_old}
              />
              <Setting
                id="delete-on-search"
                name="delete-on-search"
                label="Delete on search"
                description="Automatically delete all existing unseen jobs before each search."
                value={data.delete_on_search}
              />
            </div>
            <div className={classes.actions}>
              <button type="reset">Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SettingsForm;
