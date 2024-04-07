import { Job } from "../types/Job";
const BASE_URL = "https://findwork.dev/api/jobs?";

// This is only put here because this is a test project.
// In real projects once i
const apiKey = "5443501c70c958703a3fa740971fd1681cef9f58";

let jobList: Job[] = [];

export const fetchJob = (id: string): Job | undefined => {
  // The API I am using does not support /jobs/id search so we are
  // filtering through the existing list of jobs from the initial search
  const filtered = jobList.filter((job) => job.id === id);
  return filtered.length > 0 ? filtered[0] : undefined;
};

const fetchJobsLive = async (query: string) => {
  const apiUrl = `${BASE_URL}/search`;

  try {
    const response = await fetch(`${apiUrl}?search=${query}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const json = await response.json();
    const data = json.results;
    jobList = data;
    return data || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const fetchJobs = async (
  query: string
  // testMode = true
): Promise<Job[]> => {
  return await fetchJobsLive(query);
};