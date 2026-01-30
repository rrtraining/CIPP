import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { Box, Container, Card, CardContent, CardHeader, Typography, Grid, Chip, CircularProgress, Alert } from "@mui/material";
import { Router, CheckCircle, Refresh } from "@mui/icons-material";
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

  const data = statusQuery.data?.data;
  const results = data?.results || {};

  const InfoRow = ({ label, value }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        {value || "N/A"}
      </Typography>
    </Box>
  );

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
    return (
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Alert severity="error">{statusQuery.error.message}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4">{pageTitle}</Typography>
          <Chip
            label={data?.status === "success" ? "Online" : "Offline"}
            color={data?.status === "success" ? "success" : "error"}
            icon={<CheckCircle />}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader avatar={<Router color="primary" />} title="Device Information" />
              <CardContent>
                <InfoRow label="Hostname" value={results.hostname} />
                <InfoRow label="Model" value={`${results.model_name || ""} ${results.model_number || ""}`} />
                <InfoRow label="Model ID" value={results.model} />
                <InfoRow label="Serial Number" value={data?.serial} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader avatar={<Router color="primary" />} title="Firmware Information" />
              <CardContent>
                <InfoRow label="Version" value={data?.version} />
                <InfoRow label="Build" value={data?.build} />
                <InfoRow label="VDOM" value={data?.vdom} />
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
