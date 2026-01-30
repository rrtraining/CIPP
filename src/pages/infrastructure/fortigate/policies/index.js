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

  const simpleColumns = ["policyid", "name", "srcintf_name", "dstintf_name", "action", "status"];

  // Transform function to format the data
  const dataTransform = (data) => {
    if (!data?.data?.results) return [];
    const policies = data.data.results;
    const policyList = Array.isArray(policies) ? policies : Object.values(policies);
    return policyList.map((policy) => ({
      ...policy,
      id: policy.policyid || policy.name,
      srcintf_name: Array.isArray(policy.srcintf) ? policy.srcintf.map((i) => i.name).join(", ") : policy.srcintf?.name || policy.srcintf || "N/A",
      dstintf_name: Array.isArray(policy.dstintf) ? policy.dstintf.map((i) => i.name).join(", ") : policy.dstintf?.name || policy.dstintf || "N/A",
      action: policy.action || "N/A",
      status: policy.status || "N/A",
    }));
  };

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
      dataTransform={dataTransform}
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
