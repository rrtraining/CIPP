import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { Box, Container, Card, CardContent, CardHeader, Typography, Grid, Chip, CircularProgress, Alert } from "@mui/material";
import { Router, CheckCircle, Memory, Storage, Speed } from "@mui/icons-material";
import { ApiGetCall } from "../../../../api/ApiCall.jsx";

const InfoRow = ({ label, value }) => {
  // Ensure value is always a string for React rendering
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

const Page = () => {
  const pageTitle = "FortiGate System Status";

  // Use ApiGetCall directly as a hook - don't wrap in another useQuery
  const statusQuery = ApiGetCall({
    url: "/api/ExecInfrastructureQuery",
    data: { system: "fortigate", action: "system_status", params: "{}" },
    queryKey: "fortigate-system-status",
    staleTime: 30000,
    waiting: true,
  });

  // Extract data from API response
  // Response structure: { success, system, action, timestamp, data: { results, serial, version, build, vdom, ... } }
  const apiData = statusQuery.data?.data || statusQuery.data || {};
  const results = apiData?.results || {};

  if (statusQuery.isLoading) {
    return (
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 4 }}>{pageTitle}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (statusQuery.isError) {
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

  // Determine online status
  const isOnline = apiData?.status === "success" || results?.hostname;
  
  // Build display values
  const modelDisplay = [results.model_name, results.model_number].filter(Boolean).join(" ") || results.model || "N/A";

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
          {/* Device Information Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader avatar={<Router color="primary" />} title="Device Information" />
              <CardContent>
                <InfoRow label="Hostname" value={results.hostname} />
                <InfoRow label="Model" value={modelDisplay} />
                <InfoRow label="Model ID" value={results.model} />
                <InfoRow label="Serial Number" value={apiData.serial} />
              </CardContent>
            </Card>
          </Grid>

          {/* Firmware Information Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader avatar={<Memory color="primary" />} title="Firmware Information" />
              <CardContent>
                <InfoRow label="Version" value={apiData.version} />
                <InfoRow label="Build" value={apiData.build} />
                <InfoRow label="VDOM" value={apiData.vdom} />
                <InfoRow label="Log Disk Status" value={results.log_disk_status} />
              </CardContent>
            </Card>
          </Grid>

          {/* Additional System Info Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader avatar={<Storage color="primary" />} title="System Details" />
              <CardContent>
                <InfoRow label="HTTP Method" value={apiData.http_method} />
                <InfoRow label="Path" value={apiData.path} />
                <InfoRow label="Status" value={apiData.status} />
                <InfoRow label="Name" value={apiData.name} />
              </CardContent>
            </Card>
          </Grid>

          {/* Raw Data Debug Card - can remove later */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader avatar={<Speed color="primary" />} title="API Response Info" />
              <CardContent>
                <InfoRow label="Success" value={statusQuery.data?.success} />
                <InfoRow label="System" value={statusQuery.data?.system} />
                <InfoRow label="Action" value={statusQuery.data?.action} />
                <InfoRow label="Timestamp" value={statusQuery.data?.timestamp} />
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
