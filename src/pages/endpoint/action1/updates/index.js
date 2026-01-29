import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { useSettings } from "../../../../hooks/use-settings";
import { Update, OpenInNew } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Action1 Missing Updates";
  const tenantFilter = useSettings().currentTenant;

  const actions = [
    {
      label: "View KB Article",
      link: `https://support.microsoft.com/help/[kb_article]`,
      color: "info",
      icon: <OpenInNew />,
      target: "_blank",
      multiPost: false,
      external: true,
      condition: (row) => row.kb_article && row.kb_article !== "None" && row.kb_article !== "",
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["title", "severity", "product", "update_type", "update_source", "release_date", "reboot_needed"],
    actions: actions,
  };

  const simpleColumns = [
    "title",
    "severity",
    "product",
    "update_type",
    "update_source",
    "kb_article",
    "release_date",
    "reboot_needed",
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
          <Update sx={{ mr: 1 }} />
          Missing Patches & Updates
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
