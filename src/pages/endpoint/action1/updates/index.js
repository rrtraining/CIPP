import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { useSettings } from "../../../../hooks/use-settings";
import { Update, SystemUpdateAlt, Visibility } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Action1 Missing Updates";
  const tenantFilter = useSettings().currentTenant;

  const actions = [
    {
      label: "View KB Article",
      link: `https://support.microsoft.com/help/[kb_article]`,
      color: "info",
      icon: <Visibility />,
      target: "_blank",
      multiPost: false,
      external: true,
      condition: (row) => row.kb_article,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["title", "severity", "product", "classification", "description"],
    actions: actions,
  };

  const simpleColumns = [
    "title",
    "severity",
    "kb_article",
    "product",
    "classification",
    "release_date",
    "affected_endpoints",
    "endpoint_name",
  ];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ListAction1MissingUpdates"
      apiData={{
        tenantFilter: tenantFilter,
      }}
      queryKey={`Action1MissingUpdates-${tenantFilter}`}
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      cardButton={
        <>
          <SystemUpdateAlt sx={{ mr: 1 }} />
          Missing Patches & Updates
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
