import { Layout as DashboardLayout } from "../../layouts/index.js";
import { Box, Container, Grid, Card, CardContent, CardHeader, Typography, Chip, Stack, CircularProgress, Alert } from "@mui/material";
import { Storage, Router, Computer, CheckCircle, Error as ErrorIcon, Warning } from "@mui/icons-material";
import { ApiGetCall } from "../../api/ApiCall.jsx";

const SystemStatusCard = ({ title, icon, status, details, loading, error }) => {
  const getStatusColor = (status) => {
    if (status === "online" || status === "success") return "success";
    if (status === "warning") return "warning";
    if (status === "error" || status === "offline") return "error";
    return "default";
  };

  const getStatusIcon = (status) => {
    if (status === "online" || status === "success") return <CheckCircle color="success" />;
    if (status === "warning") return <Warning color="warning" />;
    if (status === "error" || status === "offline") return <ErrorIcon color="error" />;
    return null;
  };

  // Ensure error is a string
  const errorMessage = error ? (typeof error === "string" ? error : JSON.stringify(error)) : null;

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        avatar={icon}
        title={title}
        action={
          loading ? (
            <CircularProgress size={24} />
          ) : (
            <Chip
              label={String(status || "unknown")}
              color={getStatusColor(status)}
              size="small"
              icon={getStatusIcon(status)}
            />
          )
        }
      />
      <CardContent>
        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        ) : loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : details && details.length > 0 ? (
          <Stack spacing={1}>
            {details.map((detail, index) => (
              <Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  {String(detail.label || "")}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {String(detail.value ?? "N/A")}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">No data available</Typography>
        )}
      </CardContent>
    </Card>
  );
};

const Page = () => {
  // Use ApiGetCall directly as hooks - don't wrap in useQuery
  const proxmoxQuery = ApiGetCall({
    url: "/api/ExecInfrastructureQuery",
    data: { system: "proxmox", action: "list_nodes", params: "{}" },
    queryKey: "infrastructure-proxmox-nodes",
    staleTime: 30000,
    waiting: true,
  });

  const fortigateQuery = ApiGetCall({
    url: "/api/ExecInfrastructureQuery",
    data: { system: "fortigate", action: "system_status", params: "{}" },
    queryKey: "infrastructure-fortigate-status",
    staleTime: 30000,
    waiting: true,
  });

  const action1Query = ApiGetCall({
    url: "/api/ExecInfrastructureQuery",
    data: { system: "action1", action: "list_endpoints", params: "{}" },
    queryKey: "infrastructure-action1-endpoints",
    staleTime: 30000,
    waiting: true,
  });

  // Process Proxmox data
  const proxmoxDetails = [];
  let proxmoxStatus = "unknown";
  let proxmoxError = null;
  
  try {
    const proxmoxData = proxmoxQuery.data?.data?.data || proxmoxQuery.data?.data || [];
    if (Array.isArray(proxmoxData) && proxmoxData.length > 0) {
      const nodes = proxmoxData;
      const onlineNodes = nodes.filter((n) => n.status === "online").length;
      proxmoxStatus = onlineNodes === nodes.length ? "online" : "warning";
      proxmoxDetails.push({ label: "Total Nodes", value: nodes.length });
      proxmoxDetails.push({ label: "Online", value: onlineNodes });
      const totalCPU = nodes.reduce((sum, n) => sum + (n.maxcpu || 0), 0);
      const totalMem = nodes.reduce((sum, n) => sum + (n.maxmem || 0), 0);
      proxmoxDetails.push({ label: "Total CPU Cores", value: totalCPU });
      proxmoxDetails.push({ label: "Total Memory", value: `${Math.round(totalMem / 1024 / 1024 / 1024)} GB` });
    }
  } catch (e) {
    proxmoxError = e.message;
  }
  
  if (proxmoxQuery.isError) {
    proxmoxError = proxmoxQuery.error?.message || String(proxmoxQuery.error);
  }

  // Process FortiGate data
  const fortigateDetails = [];
  let fortigateStatus = "unknown";
  let fortigateError = null;
  
  try {
    const fgData = fortigateQuery.data?.data;
    if (fgData) {
      const results = fgData.results || fgData;
      fortigateStatus = fgData.status === "success" || results.hostname ? "online" : "error";
      fortigateDetails.push({ label: "Hostname", value: results.hostname || "N/A" });
      const modelName = results.model_name || results.model || "";
      const modelNum = results.model_number || "";
      fortigateDetails.push({ label: "Model", value: `${modelName} ${modelNum}`.trim() || "N/A" });
      fortigateDetails.push({ label: "Version", value: fgData.version || results.version || "N/A" });
      fortigateDetails.push({ label: "Serial", value: fgData.serial || results.serial || "N/A" });
    }
  } catch (e) {
    fortigateError = e.message;
  }
  
  if (fortigateQuery.isError) {
    fortigateError = fortigateQuery.error?.message || String(fortigateQuery.error);
  }

  // Process Action1 data
  const action1Details = [];
  let action1Status = "unknown";
  let action1Error = null;
  
  try {
    const a1Data = action1Query.data?.data;
    const endpoints = a1Data?.items || (Array.isArray(a1Data) ? a1Data : []);
    if (endpoints.length > 0) {
      const connected = endpoints.filter((e) => e.status === "Connected" || e.status === "Online").length;
      action1Status = connected > 0 ? "online" : "warning";
      action1Details.push({ label: "Total Endpoints", value: a1Data?.total_items || endpoints.length });
      action1Details.push({ label: "Connected", value: connected });
      action1Details.push({ label: "Disconnected", value: endpoints.length - connected });
      const withUpdates = endpoints.filter((e) => {
        const updates = e.missing_updates;
        if (!updates) return false;
        return (updates.critical || 0) > 0 || (updates.other || 0) > 0;
      }).length;
      action1Details.push({ label: "Needs Updates", value: withUpdates });
    }
  } catch (e) {
    action1Error = e.message;
  }
  
  if (action1Query.isError) {
    action1Error = action1Query.error?.message || String(action1Query.error);
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 4 }}>
          Infrastructure Overview
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SystemStatusCard
              title="Proxmox Cluster"
              icon={<Storage color="primary" />}
              status={proxmoxStatus}
              details={proxmoxDetails}
              loading={proxmoxQuery.isLoading}
              error={proxmoxError}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <SystemStatusCard
              title="FortiGate Firewall"
              icon={<Router color="primary" />}
              status={fortigateStatus}
              details={fortigateDetails}
              loading={fortigateQuery.isLoading}
              error={fortigateError}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <SystemStatusCard
              title="Action1 RMM"
              icon={<Computer color="primary" />}
              status={action1Status}
              details={action1Details}
              loading={action1Query.isLoading}
              error={action1Error}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
