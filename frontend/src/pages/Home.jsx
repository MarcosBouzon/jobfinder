import { useEffect } from "react";
import JobsTable from "../components/JobsTable/JobsTable";
import Spinner from "../components/UI/Spinner";
import { useGetJobsQuery } from "../features/api/apiSlice";
import { createNotification } from "../store/notifications";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:5100/", {
  cors: {
    origin: "http://localhost:5173/",
  },
});

const Home = () => {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetJobsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("reload_page", () => {
      refetch();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isError) {
      dispatch(
        createNotification({
          title: "Error",
          message: "An error occurred when loading new jobs!",
          error: true,
        })
      );
    }
  }, [isError]);

  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && <JobsTable jobs={data.jobs} />}
    </>
  );
};

export default Home;
