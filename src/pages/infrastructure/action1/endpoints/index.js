import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Computer, Visibility, Refresh } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Action1 Endpoints (MCP)";

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
    {
      label: "Trigger Scan",
      icon: <Refresh />,
      color: "warning",
      confirmText: "Are you sure you want to trigger a scan on this endpoint?",
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["name", "status", "OS", "address", "user", "agent_version", "last_seen", "missing_updates", "vulnerabilities"],
    actions: actions,
  };

  const simpleColumns = ["name", "status", "platform", "OS", "address", "user", "last_seen", "update_status", "vulnerability_status"];

  // Transform function to format the data
  const dataTransform = (data) => {
    if (!data?.data?.items) return [];
    return data.data.items.map((endpoint) => ({
      ...endpoint,
      missing_updates_display: endpoint.missing_updates
        ? `Critical: ${endpoint.missing_updates.critical || 0}, Other: ${endpoint.missing_updates.other || 0}`
        : "N/A",
      vulnerabilities_display: endpoint.vulnerabilities
        ? `Critical: ${endpoint.vulnerabilities.critical || 0}, Other: ${endpoint.vulnerabilities.other || 0}`
        : "N/A",
    }));
  };

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "action1",
        action: "list_endpoints",
        params: "{}",
      }}
      apiDataKey="data.items"
      queryKey="Action1EndpointsMCP"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      dataTransform={dataTransform}
      cardButton={
        <>
          <Computer sx={{ mr: 1 }} />
          Action1 Managed Endpoints (via MCP)
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
