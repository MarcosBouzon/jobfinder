import SettingsForm from "../components/SettingsForm/SettingsForm";
import CredentialsForm from "../components/CredentialsForm/CredentialsForm";
import Spinner from "../components/UI/Spinner";
import { useGetSettingsQuery } from "../features/api/apiSlice";

const Settings = () => {
  const { data, isLoading, isSuccess, isError } = useGetSettingsQuery();

  const renderView = () => {
    if (isLoading) {
      return <Spinner />;
    } else if (isSuccess && data.show_welcome === false) {
      return (
        <SettingsForm
          data={data}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
        />
      );
    } else {
      return <CredentialsForm />;
    }
  };

  return <>{renderView()}</>;
};

export default Settings;
