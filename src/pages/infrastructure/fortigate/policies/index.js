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

  // Transform function to format the data - handles multiple response formats
  const dataTransform = (data) => {
    // Try different paths for the policy data
    let policies = data?.data?.results || data?.data || data?.results || data || [];
    
    // Handle both array and object formats
    if (!Array.isArray(policies)) {
      if (typeof policies === "object" && policies !== null) {
        policies = Object.values(policies);
      } else {
        return [];
      }
    }
    
    return policies.map((policy, index) => {
      // Handle srcintf - could be array of objects, single object, or string
      let srcintf = policy.srcintf;
      let srcintf_name = "N/A";
      if (Array.isArray(srcintf)) {
        srcintf_name = srcintf.map((i) => i.name || i).join(", ");
      } else if (typeof srcintf === "object" && srcintf !== null) {
        srcintf_name = srcintf.name || String(srcintf);
      } else if (srcintf) {
        srcintf_name = String(srcintf);
      }
      
      // Handle dstintf - could be array of objects, single object, or string
      let dstintf = policy.dstintf;
      let dstintf_name = "N/A";
      if (Array.isArray(dstintf)) {
        dstintf_name = dstintf.map((i) => i.name || i).join(", ");
      } else if (typeof dstintf === "object" && dstintf !== null) {
        dstintf_name = dstintf.name || String(dstintf);
      } else if (dstintf) {
        dstintf_name = String(dstintf);
      }
      
      return {
        ...policy,
        id: policy.policyid || policy.name || `policy-${index}`,
        policyid: String(policy.policyid ?? index),
        name: String(policy.name || "N/A"),
        srcintf_name: srcintf_name,
        dstintf_name: dstintf_name,
        action: String(policy.action || "N/A"),
        status: String(policy.status || "N/A"),
      };
    });
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
      apiDataKey="data"
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
