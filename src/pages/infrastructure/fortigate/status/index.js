import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { Box, Container, Card, CardContent, CardHeader, Typography, Grid, Chip, CircularProgress, Alert } from "@mui/material";
import { Router, CheckCircle } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { ApiGetCall } from "../../../../api/ApiCall.jsx";

const Page = () => {
  const pageTitle = "FortiGate System Status";

  const statusQuery = useQuery({
    queryKey: ["fortigate-system-status"],
    queryFn: () =>
      ApiGetCall({
        url: "/api/ExecInfrastructureQuery",
        data: { system: "fortigate", action: "system_status", params: "{}" },
      }),
    staleTime: 30000,
  });

  const data = statusQuery.data?.data || {};
  const results = data?.results || data || {};

  const InfoRow = ({ label, value }) => {
    // Ensure value is always a string
    const displayValue = value === null || value === undefined ? "N/A" : 
      typeof value === "object" ? JSON.stringify(value) : String(value);
    
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="body2" color="text.secondary">
          {String(label)}
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {displayValue}
        </Typography>
      </Box>
    );
  };

  if (statusQuery.isLoading) {
    return (
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (statusQuery.error) {
    const errorMsg = statusQuery.error?.message || 
      (typeof statusQuery.error === "string" ? statusQuery.error : JSON.stringify(statusQuery.error));
    return (
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 4 }}>{pageTitle}</Typography>
          <Alert severity="error">{errorMsg}</Alert>
        </Container>
      </Box>
    );
  }

  const isOnline = data?.status === "success" || results.hostname;
  const modelDisplay = `${results.model_name || ""} ${results.model_number || ""}`.trim() || results.model || "N/A";

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4">{pageTitle}</Typography>
          <Chip
            label={isOnline ? "Online" : "Offline"}
            color={isOnline ? "success" : "error"}
            icon={<CheckCircle />}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader avatar={<Router color="primary" />} title="Device Information" />
              <CardContent>
                <InfoRow label="Hostname" value={results.hostname} />
                <InfoRow label="Model" value={modelDisplay} />
                <InfoRow label="Model ID" value={results.model} />
                <InfoRow label="Serial Number" value={data?.serial || results.serial} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader avatar={<Router color="primary" />} title="Firmware Information" />
              <CardContent>
                <InfoRow label="Version" value={data?.version || results.version} />
                <InfoRow label="Build" value={data?.build || results.build} />
                <InfoRow label="VDOM" value={data?.vdom || results.vdom} />
                <InfoRow label="Log Disk Status" value={results.log_disk_status} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
