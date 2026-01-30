import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { SettingsEthernet, Visibility } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "FortiGate Interfaces";

  const actions = [
    {
      label: "View Details",
      icon: <Visibility />,
      color: "info",
      noConfirm: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["name", "ip", "status", "type", "vdom", "mtu", "speed", "allowaccess"],
    actions: actions,
  };

  // Columns to display
  const simpleColumns = ["name", "ip", "status", "type", "vdom", "mtu"];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "fortigate",
        action: "interfaces",
        params: "{}",
      }}
      apiDataKey="data.results"
      queryKey="FortiGateInterfaces"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      columnsFromApi={true}
      cardButton={
        <>
          <SettingsEthernet sx={{ mr: 1 }} />
          Network Interfaces
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
