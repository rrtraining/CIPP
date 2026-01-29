import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { useSettings } from "../../../../hooks/use-settings";
import { Computer, Security, Update, Visibility } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Action1 Endpoints";
  const tenantFilter = useSettings().currentTenant;

  const actions = [
    {
      label: "View in Action1",
      link: `https://app.action1.com/endpoints/[id]`,
      color: "info",
      icon: <Visibility />,
      target: "_blank",
      multiPost: false,
      external: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["name", "hostname", "os_name", "ip_address"],
    actions: actions,
  };

  // Custom cell rendering for status with color coding
  const simpleColumns = [
    "name",
    "hostname",
    "status",
    "platform",
    "os_name",
    "os_version",
    "ip_address",
    "last_seen",
    "agent_version",
    "missing_updates",
  ];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ListAction1Endpoints"
      apiData={{
        tenantFilter: tenantFilter,
      }}
      queryKey={`Action1Endpoints-${tenantFilter}`}
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      cardButton={
        <>
          <Computer sx={{ mr: 1 }} />
          Action1 Managed Endpoints
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
