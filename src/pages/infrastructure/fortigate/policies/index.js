import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Security, Visibility } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "FortiGate Firewall Policies";

  const actions = [
    {
      label: "View Details",
      icon: <Visibility />,
      color: "info",
      noConfirm: true,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["policyid", "name", "srcintf", "dstintf", "srcaddr", "dstaddr", "action", "status"],
    actions: actions,
  };

  // Columns to display - using transformed field names
  const simpleColumns = ["policyid", "name", "srcintf_name", "dstintf_name", "action", "status"];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ExecInfrastructureQuery"
      apiData={{
        system: "fortigate",
        action: "firewall_policies",
        params: "{}",
      }}
      apiDataKey="data.results"
      queryKey="FortiGatePolicies"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
      columnsFromApi={true}
      cardButton={
        <>
          <Security sx={{ mr: 1 }} />
          Firewall Policies
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
