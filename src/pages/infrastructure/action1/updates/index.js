import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { SystemUpdate, OpenInNew, CheckCircle } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Action1 Missing Updates (MCP)";

  const actions = [
    {
      label: "View KB Article",
      link: `https://support.microsoft.com/kb/[kb_id]`,
      color: "info",
      icon: <OpenInNew />,
      target: "_blank",
      multiPost: false,
      external: true,
    },
    {
      label: "Approve Update",
      icon: <CheckCircle />,
      color: "success",
      confirmText: "Are you sure you want to approve this update for deployment?",
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["title", "severity", "kb_id", "release_date", "affected_endpoints", "approval_status"],
    actions: actions,
  };

  const simpleColumns = ["title", "severity", "kb_id", "release_date", "affected_endpoints", "approval_status"];

  // Transform function to format the data
  const dataTransform = (data) => {
    if (!data?.data?.items) return [];
    return data.data.items.map((update, index) => ({
      ...update,
      id: update.update_id || update.kb_id || `update-${index}`,
    }));
  };

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "action1",
        action: "list_available_updates",
        params: "{}",
      }}
      apiDataKey="data.items"
      queryKey="Action1UpdatesMCP"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      dataTransform={dataTransform}
      cardButton={
        <>
          <SystemUpdate sx={{ mr: 1 }} />
          Available Updates (via MCP)
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
