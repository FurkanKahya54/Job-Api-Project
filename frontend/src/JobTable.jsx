import { useEffect, useState } from "react";

export default function JobTable() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ type: "", command_or_url: "" });

  // Backend'den job listesini çek
  const fetchJobs = () => {
    fetch("http://localhost:5000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  };

  // Component yüklendiğinde job listesini çek
  useEffect(() => {
    fetchJobs();
  }, []);

  // Yeni job ekleme
  const addJob = () => {
    fetch("http://localhost:5000/job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    })
      .then(res => res.json())
      .then(() => {
        fetchJobs(); // tabloyu güncelle
        setNewJob({ type: "", command_or_url: "" }); // formu temizle
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Type (os/crawl)"
          value={newJob.type}
          onChange={e => setNewJob({ ...newJob, type: e.target.value })}
        />
        <input
          placeholder="Command or URL"
          value={newJob.command_or_url}
          onChange={e => setNewJob({ ...newJob, command_or_url: e.target.value })}
        />
        <button onClick={addJob}>Run</button>
      </div>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Command / URL</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.type}</td>
              <td>{job.command_or_url}</td>
              <td>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
