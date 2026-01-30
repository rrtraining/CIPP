import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { SystemUpdate, OpenInNew, CheckCircle } from "@mui/icons-material";
import { Chip } from "@mui/material";

const Page = () => {
  const pageTitle = "Action1 Missing Updates (MCP)";

  const actions = [
    {
      label: "View in Action1",
      link: `[self]`,
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
    extendedInfoFields: [
      "name",
      "vendor", 
      "version",
      "security_severity", 
      "approval_status", 
      "update_type",
      "update_source",
      "reboot_needed", 
      "kb_number", 
      "release_date",
      "description"
    ],
    actions: actions,
  };

  // Define explicit columns to display
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      size: 200,
    },
    {
      header: "Vendor",
      accessorKey: "vendor",
      size: 150,
    },
    {
      header: "Version",
      accessorKey: "version",
      size: 100,
    },
    {
      header: "Severity",
      accessorKey: "security_severity",
      size: 120,
      cell: ({ row }) => {
        const severity = row.original.security_severity || "Unspecified";
        const colorMap = {
          "Critical": "error",
          "Important": "warning",
          "Moderate": "info",
          "Low": "default",
          "Unspecified": "default"
        };
        return <Chip label={severity} color={colorMap[severity] || "default"} size="small" />;
      }
    },
    {
      header: "Status",
      accessorKey: "approval_status",
      size: 100,
      cell: ({ row }) => {
        const status = row.original.approval_status || "Unknown";
        const colorMap = {
          "Approved": "success",
          "New": "warning",
          "Declined": "error",
          "Unknown": "default"
        };
        return <Chip label={status} color={colorMap[status] || "default"} size="small" />;
      }
    },
    {
      header: "Type",
      accessorKey: "update_type",
      size: 120,
    },
    {
      header: "Source",
      accessorKey: "update_source",
      size: 130,
    },
    {
      header: "Release Date",
      accessorKey: "release_date",
      size: 110,
    },
  ];

  // Transform function to flatten the nested versions data
  const dataTransform = (items) => {
    if (!Array.isArray(items)) {
      return [];
    }
    
    return items.map((update, index) => {
      // Get the first version for nested fields
      const version = update.versions?.[0] || {};
      
      return {
        // Keep original fields
        ...update,
        // Ensure ID exists
        id: update.id || `update-${index}`,
        // Flatten version data to top level
        version: String(version.version || "Latest"),
        security_severity: String(version.security_severity || update.security_severity || "Unspecified"),
        release_date: String(version.release_date || update.release_date || "N/A"),
        approval_status: String(version.approval_status || update.approval_status || "Unknown"),
        // Ensure these are strings
        name: String(update.name || "Unknown"),
        vendor: String(update.vendor || "-"),
        update_type: String(version.update_type || update.update_type || "-"),
        update_source: String(update.update_source || "-"),
        reboot_needed: String(update.reboot_needed || "-"),
        kb_number: String(update.kb_number || "-"),
        description: String(update.description || "-"),
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
      apiDataKey="data.items"
      queryKey="Action1UpdatesMCP"
      columns={columns}
      actions={actions}
      offCanvas={offCanvas}
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
