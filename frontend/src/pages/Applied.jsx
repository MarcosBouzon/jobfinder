import JobsTable from "../components/JobsTable/JobsTable";
import JobsForm from "../components/JobsTable/JobsForm";
import Spinner from "../components/UI/Spinner";
import { useSearchJobsQuery } from "../features/api/apiSlice";
import { useState } from "react";

const Applied = () => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const { data, isLoading, isSuccess, isError } = useSearchJobsQuery({
    title,
    company,
  });

  const setTitleHandler = (value) => {
    setTitle((prev) => value);
  };
  const setCompanyHandler = (value) => {
    setCompany((prev) => value);
  };

  return (
    <>
      <JobsForm setTitle={setTitleHandler} setCompany={setCompanyHandler} />
      {isLoading && <Spinner />}
      {isSuccess && <JobsTable jobs={data} forApplied={true} />}
    </>
  );
};

export default Applied;
