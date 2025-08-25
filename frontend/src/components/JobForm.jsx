import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { createOsJob, createCrawlJob } from "../api/jobs";

const JobForm = ({ onJobAdded }) => {
  const [command, setCommand] = useState("");
  const [url, setUrl] = useState("");

  const handleOsSubmit = async () => {
    const job = await createOsJob(command || "ls");
    onJobAdded(job);
    setCommand("");
  };

  const handleCrawlSubmit = async () => {
    const job = await createCrawlJob(url);
    onJobAdded(job);
    setUrl("");
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
      <TextField label="OS Command" value={command} onChange={e => setCommand(e.target.value)} />
      <Button variant="contained" onClick={handleOsSubmit}>Run OS Job</Button>

      <TextField label="Crawl URL" value={url} onChange={e => setUrl(e.target.value)} />
      <Button variant="contained" onClick={handleCrawlSubmit}>Run Crawl Job</Button>
    </Box>
  );
};

export default JobForm;
