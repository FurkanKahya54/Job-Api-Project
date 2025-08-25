import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import JobList from "./components/JobList";
import { Container, Typography } from "@mui/material";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container maxWidth="md" style={{ marginTop: 32 }}>
        <Typography variant="h4" gutterBottom>
          Job Management Dashboard
        </Typography>
        <JobList />
      </Container>
    </QueryClientProvider>
  );
}

export default App;
