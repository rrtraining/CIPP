import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Security, OpenInNew } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Action1 Vulnerabilities (MCP)";

  const actions = [
    {
      label: "View CVE Details",
      link: `https://nvd.nist.gov/vuln/detail/[cve_id]`,
      color: "info",
      icon: <OpenInNew />,
      target: "_blank",
      multiPost: false,
      external: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["cve_id", "severity", "cvss_score", "affected_product", "affected_endpoints", "published_date", "remediation_status"],
    actions: actions,
  };

  const simpleColumns = ["cve_id", "severity", "cvss_score", "affected_product", "affected_endpoints", "remediation_status", "published_date"];

  // Transform function to format the data
  const dataTransform = (data) => {
    if (!data?.data?.items) return [];
    return data.data.items.map((vuln) => ({
      ...vuln,
      id: vuln.cve_id || vuln.id,
    }));
  };

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "action1",
        action: "list_vulnerabilities",
        params: JSON.stringify({ severity: "all" }),
      }}
      apiDataKey="data.items"
      queryKey="Action1VulnerabilitiesMCP"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      dataTransform={dataTransform}
      cardButton={
        <>
          <Security sx={{ mr: 1 }} />
          CVE Vulnerabilities (via MCP)
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
