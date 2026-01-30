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

  // Transform function to format the data - handles multiple response formats
  const dataTransform = (data) => {
    // Try different paths for the interface data
    let interfaces = data?.data?.results || data?.data || data?.results || data || [];
    
    // Handle both array and object formats
    if (!Array.isArray(interfaces)) {
      if (typeof interfaces === "object" && interfaces !== null) {
        interfaces = Object.values(interfaces);
      } else {
        return [];
      }
    }
    
    return interfaces.map((iface, index) => ({
      ...iface,
      id: iface.name || `iface-${index}`,
      name: String(iface.name || "N/A"),
      ip: String(iface.ip || iface.ipaddr || "N/A"),
      status: String(iface.status || "unknown"),
      type: String(iface.type || "N/A"),
      vdom: String(iface.vdom || "root"),
      mtu: String(iface.mtu || "N/A"),
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
      apiDataKey="data"
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
