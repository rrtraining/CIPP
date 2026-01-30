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
    extendedInfoFields: ["title", "vendor", "severity", "approval_status", "update_type", "reboot_needed", "kb_id", "release_date"],
    actions: actions,
  };

  const simpleColumns = ["title", "vendor", "severity", "approval_status", "update_type"];

  // Transform function to format the data - handles Action1 MCP response format
  const dataTransform = (data) => {
    // After apiDataKey extraction, data is: { id, type, items[], total_items, ... }
    // Check multiple paths for compatibility
    let updates = data?.items || data?.updates || data?.data?.items || data?.data?.updates || [];
    
    // If it's not an array, try to extract from object
    if (!Array.isArray(updates)) {
      if (typeof updates === "object" && updates !== null) {
        updates = Object.values(updates);
      } else {
        return [];
      }
    }
    
    return updates.map((update, index) => {
      // Get the first version for nested fields (severity, release_date, approval_status)
      const version = update.versions?.[0] || {};
      
      return {
        ...update,
        id: update.id || update.update_id || `update-${index}`,
        title: String(update.name || update.title || "N/A"),
        severity: String(version.security_severity || update.severity || "Unspecified"),
        kb_id: String(update.kb_number || update.kb_id || "-"),
        release_date: String(version.release_date || update.release_date || "-"),
        affected_endpoints: String(update.affected_endpoints ?? update.endpoint_count ?? "-"),
        approval_status: String(version.approval_status || update.approval_status || update.status || "Unknown"),
        vendor: String(update.vendor || "-"),
        update_type: String(update.update_type || "-"),
        reboot_needed: String(update.reboot_needed || "-"),
      };
    });
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
