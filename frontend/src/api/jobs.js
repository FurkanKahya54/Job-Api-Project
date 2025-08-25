const BASE_URL = "http://localhost:5000";

export const fetchJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`);
  return res.json();
};

export const createOsJob = async (command) => {
  const res = await fetch(`${BASE_URL}/job/os`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command }),
  });
  return res.json();
};

export const createCrawlJob = async (url) => {
  const res = await fetch(`${BASE_URL}/job/crawl`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return res.json();
};
