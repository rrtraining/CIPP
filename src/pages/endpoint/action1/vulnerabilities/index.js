import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { useSettings } from "../../../../hooks/use-settings";
import { Security, BugReport, Visibility } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Action1 Vulnerabilities";
  const tenantFilter = useSettings().currentTenant;

  const actions = [
    {
      label: "View CVE Details",
      link: `https://nvd.nist.gov/vuln/detail/[cve_id]`,
      color: "info",
      icon: <Visibility />,
      target: "_blank",
      multiPost: false,
      external: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["cve_id", "title", "severity", "cvss_score", "description"],
    actions: actions,
  };

  const simpleColumns = [
    "cve_id",
    "title",
    "severity",
    "cvss_score",
    "affected_product",
    "affected_endpoints",
    "published_date",
    "kb_article",
  ];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ListAction1Vulnerabilities"
      apiData={{
        tenantFilter: tenantFilter,
      }}
      queryKey={`Action1Vulnerabilities-${tenantFilter}`}
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      cardButton={
        <>
          <BugReport sx={{ mr: 1 }} />
          Known Vulnerabilities (CVEs)
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
