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

  // Transform function to format the data - handles multiple response formats
  const dataTransform = (data) => {
    // Try different paths for update data
    let updates = data?.data?.items || data?.data || data?.items || [];
    
    // If it's not an array, try to extract from object
    if (!Array.isArray(updates)) {
      if (typeof updates === "object" && updates !== null) {
        updates = Object.values(updates);
      } else {
        return [];
      }
    }
    
    return updates.map((update, index) => ({
      ...update,
      id: update.update_id || update.kb_id || update.id || `update-${index}`,
      title: String(update.title || update.name || "N/A"),
      severity: String(update.severity || "N/A"),
      kb_id: String(update.kb_id || update.kb_article || update.kbId || "N/A"),
      release_date: String(update.release_date || update.releaseDate || update.published_date || "N/A"),
      affected_endpoints: String(update.affected_endpoints ?? update.affectedEndpoints ?? update.endpoint_count ?? "0"),
      approval_status: String(update.approval_status || update.approvalStatus || update.status || "Pending"),
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
      apiDataKey="data"
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
