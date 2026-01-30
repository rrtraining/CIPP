import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Storage, Refresh } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Proxmox Nodes";

  const actions = [
    {
      label: "Refresh",
      icon: <Refresh />,
      color: "info",
      noConfirm: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["node", "status", "maxcpu", "maxmem", "maxdisk", "uptime"],
    actions: actions,
  };

  const simpleColumns = ["node", "status", "maxcpu", "cpu_percent", "mem_used", "disk_used", "uptime_days"];

  // Transform function to format the data
  const dataTransform = (data) => {
    if (!data?.data?.data) return [];
    return data.data.data.map((node) => ({
      ...node,
      id: node.node,
      cpu_percent: `${(node.cpu * 100).toFixed(1)}%`,
      mem_used: `${Math.round(node.mem / 1024 / 1024 / 1024)} / ${Math.round(node.maxmem / 1024 / 1024 / 1024)} GB`,
      disk_used: `${Math.round(node.disk / 1024 / 1024 / 1024)} / ${Math.round(node.maxdisk / 1024 / 1024 / 1024)} GB`,
      uptime_days: `${Math.round(node.uptime / 86400)} days`,
    }));
  };

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "proxmox",
        action: "list_nodes",
        params: "{}",
      }}
      apiDataKey="data.data"
      queryKey="ProxmoxNodes"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      dataTransform={dataTransform}
      cardButton={
        <>
          <Storage sx={{ mr: 1 }} />
          Proxmox Cluster Nodes
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
