import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { ViewInAr, PlayArrow, Stop, Refresh } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Proxmox Containers";

  const actions = [
    {
      label: "Start Container",
      icon: <PlayArrow />,
      color: "success",
      confirmText: "Are you sure you want to start this container?",
    },
    {
      label: "Stop Container",
      icon: <Stop />,
      color: "error",
      confirmText: "Are you sure you want to stop this container?",
    },
    {
      label: "Refresh",
      icon: <Refresh />,
      color: "info",
      noConfirm: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["name", "vmid", "node", "status", "maxcpu", "maxmem", "maxdisk", "uptime"],
    actions: actions,
  };

  const simpleColumns = ["name", "vmid", "node", "status", "cpu_percent", "mem_used", "uptime_formatted"];

  // Transform function to format the data
  const dataTransform = (data) => {
    if (!data?.data?.data) return [];
    // Filter for LXC containers only (type === "lxc")
    return data.data.data
      .filter((item) => item.type === "lxc")
      .map((ct) => ({
        ...ct,
        id: `${ct.node}-${ct.vmid}`,
        cpu_percent: ct.cpu ? `${(ct.cpu * 100).toFixed(1)}%` : "N/A",
        mem_used: ct.maxmem
          ? `${Math.round((ct.mem || 0) / 1024 / 1024 / 1024)} / ${Math.round(ct.maxmem / 1024 / 1024 / 1024)} GB`
          : "N/A",
        uptime_formatted: ct.uptime ? `${Math.round(ct.uptime / 3600)} hours` : "Stopped",
      }));
  };

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "proxmox",
        action: "cluster_resources",
        params: "{}",
      }}
      apiDataKey="data.data"
      queryKey="ProxmoxContainers"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      dataTransform={dataTransform}
      cardButton={
        <>
          <ViewInAr sx={{ mr: 1 }} />
          LXC Containers
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
