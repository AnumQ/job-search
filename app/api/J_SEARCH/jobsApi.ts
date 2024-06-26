import { Job, JobDetail } from "../../types/Job";
import jsearch_mock_jobs_list from "../../data/jsearch_jobs_list.json";
import jsearch_mock_job_detail from "../../data/jsearch_job_detail.json";
import { J_SEARCH_API_CONFIG, options } from "./config";

export type FETCH_JOBS_RESULT = {
  data: Job[];
  //RapidAPI JSearch API has limit on maximum requests on the FREE version
  //We wish to display this number on screen so we know how many requests we have laft
  numReq: string; // number of remaining requests
};

export const fetchJobs = async (
  query: string,
  page: number,
  isLiveMode = false
): Promise<FETCH_JOBS_RESULT> => {
  if (!isLiveMode) {
    const data = await fetchJobsFromMock();
    return { numReq: "", data: data };
  } else {
    return await fetchJobsFromLive(query, page);
  }
};

const fetchJobsFromLive = async (
  query: string,
  page: number
): Promise<FETCH_JOBS_RESULT> => {
  const apiUrl = `${J_SEARCH_API_CONFIG.BASE_URL}/search`;

  try {
    const encodedQuery = encodeURIComponent(query);
    const encodedPage = encodeURIComponent(page);

    const response = await fetch(
      `${apiUrl}?query=${encodedQuery}&page=${encodedPage}`,
      options
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Too many requests - exceeded limit");
      }
      throw new Error("Failed to fetch jobs");
    }

    const json = await response.json();
    const data = json.data;
    const numOfReqRemaining =
      response.headers.get("x-ratelimit-requests-remaining") || "";

    return {
      numReq: numOfReqRemaining,
      data: data || [],
    } as FETCH_JOBS_RESULT;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const fetchJobDetailLive = async (
  job_id: string
): Promise<JobDetail | undefined> => {
  const apiUrl = `${J_SEARCH_API_CONFIG.BASE_URL}/job-details`;

  try {
    const response = await fetch(`${apiUrl}?job_id=${job_id}`, options);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Too many requests - exceeded limit");
      }
      throw new Error("Failed to fetch job detail");
    }

    const json = await response.json();
    const data = json.data;
    return data.length > 0 ? data[0] : undefined;
  } catch (error) {
    console.error("Error fetching job detail:", error);
    throw error;
  }
};

export const fetchJobDetail = async (
  job_id: string,
  isLiveMode = false
): Promise<JobDetail | undefined> => {
  if (!isLiveMode) {
    return await fetchJobDetailMock();
  } else {
    return await fetchJobDetailLive(job_id);
  }
};

const fetchJobDetailMock = async (): Promise<JobDetail | undefined> => {
  return new Promise((resolve) => {
    // To simulate a real call, we return the mock with 200 ms delay
    setTimeout(() => {
      const jobDetailMock = jsearch_mock_job_detail as unknown;
      resolve(jobDetailMock as JobDetail);
    }, 200);
  });
};

const fetchJobsFromMock = async (): Promise<Job[]> => {
  return new Promise((resolve) => {
    const jobL = jsearch_mock_jobs_list;
    const jobs: Job[] = jobL as unknown as Job[];
    setTimeout(() => {
      resolve(jobs);
    }, 200);
  });
};
