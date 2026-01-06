import { useCallback } from "react";
import { SearchForm, StyledTextField } from "../styled/StyledComponents";

const JobsForm = (props) => {
  const titleChangeHandler = useCallback(
    (e) => {
      props.setTitle(e.target.value);
    },
    [props]
  );

  const companyChangeHandler = useCallback(
    (e) => {
      props.setCompany(e.target.value);
    },
    [props]
  );

  return (
    <SearchForm>
      <StyledTextField
        type="text"
        id="title"
        name="title"
        label="Title"
        placeholder="Search by job title"
        onChange={titleChangeHandler}
        size="small"
        sx={{ maxWidth: "300px" }}
      />
      <StyledTextField
        type="text"
        id="company"
        name="company"
        label="Company"
        placeholder="Search by job company"
        onChange={companyChangeHandler}
        size="small"
        sx={{ maxWidth: "300px" }}
      />
    </SearchForm>
  );
};

export default JobsForm;
