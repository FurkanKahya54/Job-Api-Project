import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchJobs, runOSJob, runCrawlJob } from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

const JobList = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", page, perPage, typeFilter],
    queryFn: () => fetchJobs({ page, per_page: perPage, type: typeFilter }),
  });

  const osMutation = useMutation({
    mutationFn: runOSJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const crawlMutation = useMutation({
    mutationFn: runCrawlJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const [command, setCommand] = useState("");
  const [url, setUrl] = useState("");

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading jobs</Typography>;

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        Job List & Trigger
      </Typography>

      {/* OS Job */}
      <Stack spacing={2} direction="row" marginBottom={2}>
        <TextField
          label="OS Command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => osMutation.mutate(command)}
          disabled={!command}
        >
          Run OS Job
        </Button>
      </Stack>

      {/* Crawl Job */}
      <Stack spacing={2} direction="row" marginBottom={2}>
        <TextField
          label="URL to Crawl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => crawlMutation.mutate(url)}
          disabled={!url}
        >
          Run Crawl Job
        </Button>
      </Stack>

      {/* Filter & Pagination */}
      <Stack spacing={2} direction="row" marginBottom={2}>
        <TextField
          label="Page"
          type="number"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
        />
        <TextField
          label="Per Page"
          type="number"
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="os">OS</MenuItem>
          <MenuItem value="crawl">Crawl</MenuItem>
          <MenuItem value="crawl_url">Crawl URL Detail</MenuItem>
        </Select>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Result / URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.id}</TableCell>
              <TableCell>{job.type}</TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>{job.result || job.command_or_url}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default JobList;

