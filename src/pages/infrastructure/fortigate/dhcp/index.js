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

  // Transform function to format the data
  const dataTransform = (data) => {
    if (!data?.data?.results) return [];
    const leases = data.data.results;
    // DHCP data might be nested differently
    let leaseList = [];
    if (Array.isArray(leases)) {
      leaseList = leases;
    } else if (typeof leases === "object") {
      // Handle nested structure where leases might be under interface keys
      Object.keys(leases).forEach((key) => {
        const item = leases[key];
        if (Array.isArray(item)) {
          leaseList = leaseList.concat(item.map((l) => ({ ...l, interface: key })));
        } else if (item && typeof item === "object") {
          leaseList.push({ ...item, interface: key });
        }
      });
    }
    return leaseList.map((lease, index) => ({
      ...lease,
      id: lease.mac || `lease-${index}`,
      ip: lease.ip || "N/A",
      mac: lease.mac || "N/A",
      hostname: lease.hostname || "N/A",
      interface: lease.interface || "N/A",
      expire_time: lease.expire_time || lease.expire || "N/A",
      status: lease.status || "active",
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
      apiDataKey="data.results"
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
