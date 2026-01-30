import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Dns, Visibility } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "FortiGate DHCP Leases";

  const actions = [
    {
      label: "View Details",
      icon: <Visibility />,
      color: "info",
      noConfirm: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["ip", "mac", "hostname", "interface", "expire_time", "status"],
    actions: actions,
  };

  const simpleColumns = ["ip", "mac", "hostname", "interface", "expire_time", "status"];

  // Transform function to format the data - handles multiple response formats
  const dataTransform = (data) => {
    // Try different paths for the lease data
    let leases = data?.data?.results || data?.data || data?.results || data || [];
    
    let leaseList = [];
    
    if (Array.isArray(leases)) {
      leaseList = leases;
    } else if (typeof leases === "object" && leases !== null) {
      // Handle nested structure where leases might be under interface keys
      Object.keys(leases).forEach((key) => {
        const item = leases[key];
        if (Array.isArray(item)) {
          leaseList = leaseList.concat(item.map((l) => ({ ...l, interface: key })));
        } else if (item && typeof item === "object") {
          // Check if this is a lease object or another nested structure
          if (item.ip || item.mac) {
            leaseList.push({ ...item, interface: key });
          } else {
            // Try to extract leases from nested structure
            Object.keys(item).forEach((subKey) => {
              const subItem = item[subKey];
              if (Array.isArray(subItem)) {
                leaseList = leaseList.concat(subItem.map((l) => ({ ...l, interface: `${key}/${subKey}` })));
              } else if (subItem && typeof subItem === "object" && (subItem.ip || subItem.mac)) {
                leaseList.push({ ...subItem, interface: `${key}/${subKey}` });
              }
            });
          }
        }
      });
    }
    
    return leaseList.map((lease, index) => ({
      ...lease,
      id: lease.mac || `lease-${index}`,
      ip: String(lease.ip || "N/A"),
      mac: String(lease.mac || "N/A"),
      hostname: String(lease.hostname || lease.client_hostname || "N/A"),
      interface: String(lease.interface || lease.server_mkey || "N/A"),
      expire_time: String(lease.expire_time || lease.expire || "N/A"),
      status: String(lease.status || lease.type || "active"),
    }));
  };

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "fortigate",
        action: "dhcp_leases",
        params: "{}",
      }}
      apiDataKey="data"
      queryKey="FortiGateDHCP"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      dataTransform={dataTransform}
      cardButton={
        <>
          <Dns sx={{ mr: 1 }} />
          DHCP Leases
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
