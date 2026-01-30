import { Layout as DashboardLayout } from "../../layouts/index.js";
import { Box, Container, Grid, Card, CardContent, CardHeader, Typography, Chip, Stack, CircularProgress, Alert } from "@mui/material";
import { Storage, Router, Security, Computer, CheckCircle, Error, Warning } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ApiGetCall } from "../../api/ApiCall.jsx";
import { useQuery } from "@tanstack/react-query";

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
    if (status === "error" || status === "offline") return <Error color="error" />;
    return <CircularProgress size={20} />;
  };

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
              label={status || "Unknown"}
              color={getStatusColor(status)}
              size="small"
              icon={getStatusIcon(status)}
            />
          )
        }
      />
      <CardContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : (
          <Stack spacing={1}>
            {details.map((detail, index) => (
              <Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  {detail.label}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {detail.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

const Page = () => {
  // Proxmox query
  const proxmoxQuery = useQuery({
    queryKey: ["infrastructure-proxmox-nodes"],
    queryFn: () =>
      ApiGetCall({
        url: "/api/ExecInfrastructureQuery",
        data: { system: "proxmox", action: "list_nodes", params: "{}" },
      }),
    staleTime: 30000,
  });

  // FortiGate query
  const fortigateQuery = useQuery({
    queryKey: ["infrastructure-fortigate-status"],
    queryFn: () =>
      ApiGetCall({
        url: "/api/ExecInfrastructureQuery",
        data: { system: "fortigate", action: "system_status", params: "{}" },
      }),
    staleTime: 30000,
  });

  // Action1 query
  const action1Query = useQuery({
    queryKey: ["infrastructure-action1-endpoints"],
    queryFn: () =>
      ApiGetCall({
        url: "/api/ExecInfrastructureQuery",
        data: { system: "action1", action: "list_endpoints", params: "{}" },
      }),
    staleTime: 30000,
  });

  // Process Proxmox data
  const proxmoxDetails = [];
  let proxmoxStatus = "unknown";
  if (proxmoxQuery.data?.data?.data) {
    const nodes = proxmoxQuery.data.data.data;
    const onlineNodes = nodes.filter((n) => n.status === "online").length;
    proxmoxStatus = onlineNodes === nodes.length ? "online" : "warning";
    proxmoxDetails.push({ label: "Total Nodes", value: nodes.length });
    proxmoxDetails.push({ label: "Online", value: onlineNodes });
    const totalCPU = nodes.reduce((sum, n) => sum + (n.maxcpu || 0), 0);
    const totalMem = nodes.reduce((sum, n) => sum + (n.maxmem || 0), 0);
    proxmoxDetails.push({ label: "Total CPU Cores", value: totalCPU });
    proxmoxDetails.push({ label: "Total Memory", value: `${Math.round(totalMem / 1024 / 1024 / 1024)} GB` });
  }

  // Process FortiGate data
  const fortigateDetails = [];
  let fortigateStatus = "unknown";
  if (fortigateQuery.data?.data?.results) {
    const fg = fortigateQuery.data.data;
    fortigateStatus = fg.status === "success" ? "online" : "error";
    fortigateDetails.push({ label: "Hostname", value: fg.results.hostname || "N/A" });
    fortigateDetails.push({ label: "Model", value: `${fg.results.model_name} ${fg.results.model_number}` });
    fortigateDetails.push({ label: "Version", value: fg.version || "N/A" });
    fortigateDetails.push({ label: "Serial", value: fg.serial || "N/A" });
  }

  // Process Action1 data
  const action1Details = [];
  let action1Status = "unknown";
  if (action1Query.data?.data?.items) {
    const endpoints = action1Query.data.data.items;
    const connected = endpoints.filter((e) => e.status === "Connected").length;
    action1Status = connected > 0 ? "online" : "warning";
    action1Details.push({ label: "Total Endpoints", value: action1Query.data.data.total_items || endpoints.length });
    action1Details.push({ label: "Connected", value: connected });
    action1Details.push({ label: "Disconnected", value: endpoints.length - connected });
    const withUpdates = endpoints.filter((e) => e.missing_updates?.critical > 0 || e.missing_updates?.other > 0).length;
    action1Details.push({ label: "Needs Updates", value: withUpdates });
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
              error={proxmoxQuery.error?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <SystemStatusCard
              title="FortiGate Firewall"
              icon={<Router color="primary" />}
              status={fortigateStatus}
              details={fortigateDetails}
              loading={fortigateQuery.isLoading}
              error={fortigateQuery.error?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <SystemStatusCard
              title="Action1 RMM"
              icon={<Computer color="primary" />}
              status={action1Status}
              details={action1Details}
              loading={action1Query.isLoading}
              error={action1Query.error?.message}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
