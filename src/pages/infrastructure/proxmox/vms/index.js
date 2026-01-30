import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Computer, PlayArrow, Stop, Refresh } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Proxmox Virtual Machines";

  const actions = [
    {
      label: "Start VM",
      icon: <PlayArrow />,
      color: "success",
      confirmText: "Are you sure you want to start this VM?",
    },
    {
      label: "Stop VM",
      icon: <Stop />,
      color: "error",
      confirmText: "Are you sure you want to stop this VM?",
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
    // Filter for QEMU VMs only (type === "qemu")
    return data.data.data
      .filter((item) => item.type === "qemu")
      .map((vm) => ({
        ...vm,
        id: `${vm.node}-${vm.vmid}`,
        cpu_percent: vm.cpu ? `${(vm.cpu * 100).toFixed(1)}%` : "N/A",
        mem_used: vm.maxmem
          ? `${Math.round((vm.mem || 0) / 1024 / 1024 / 1024)} / ${Math.round(vm.maxmem / 1024 / 1024 / 1024)} GB`
          : "N/A",
        uptime_formatted: vm.uptime ? `${Math.round(vm.uptime / 3600)} hours` : "Stopped",
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
      queryKey="ProxmoxVMs"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      dataTransform={dataTransform}
      cardButton={
        <>
          <Computer sx={{ mr: 1 }} />
          QEMU Virtual Machines
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
