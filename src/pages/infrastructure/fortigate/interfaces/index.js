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
    extendedInfoFields: ["name", "ip", "status", "type", "vdom", "mtu", "speed"],
    actions: actions,
  };

  const simpleColumns = ["name", "ip", "status", "type", "vdom", "mtu"];

  // Transform function to format the data
  const dataTransform = (data) => {
    if (!data?.data?.results) return [];
    const interfaces = data.data.results;
    // Handle both array and object formats
    const interfaceList = Array.isArray(interfaces) ? interfaces : Object.values(interfaces);
    return interfaceList.map((iface, index) => ({
      ...iface,
      id: iface.name || index,
      ip: iface.ip || "N/A",
      status: iface.status || "unknown",
      type: iface.type || "N/A",
      vdom: iface.vdom || "root",
      mtu: iface.mtu || "N/A",
    }));
  };

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
      dataTransform={dataTransform}
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
