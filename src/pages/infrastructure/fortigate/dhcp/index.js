import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Dns, Visibility } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "FortiGate DHCP Servers";

  const actions = [
    {
      label: "View Details",
      icon: <Visibility />,
      color: "info",
      noConfirm: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["id", "interface", "status", "default-gateway", "netmask", "lease-time", "dns-service", "ip-range"],
    actions: actions,
  };

  // Columns to display - matching FortiGate DHCP server response fields
  const simpleColumns = ["id", "interface", "status", "default-gateway", "netmask", "ip_range_display"];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "fortigate",
        action: "dhcp_leases",
        params: "{}",
      }}
      apiDataKey="data.results"
      queryKey="FortiGateDHCP"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      columnsFromApi={true}
      cardButton={
        <>
          <Dns sx={{ mr: 1 }} />
          DHCP Servers
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
