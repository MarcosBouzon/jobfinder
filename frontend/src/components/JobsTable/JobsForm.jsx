import { useCallback, useState } from "react";
import InputField from "../UI/InputField";
import classes from "./JobsForm.module.css";

const JobsForm = (props) => {
  const titleChangeHandler = useCallback((e) => {
    props.setTitle(e.target.value);
  }, [props.setTitle]);

  const companyChangeHandler = useCallback((e) => {
    props.setCompany(e.target.value);
  }, [props.setCompany]);

  return (
    <form className={classes["search-form"]}>
      <InputField
        type="text"
        id="title"
        name="title"
        label="Title"
        placeholder="Search by job title"
        onChange={titleChangeHandler}
      />
      <InputField
        type="text"
        id="company"
        name="company"
        label="Company"
        placeholder="Search by job company"
        onChange={companyChangeHandler}
      />
    </form>
  );
};

export default JobsForm;
