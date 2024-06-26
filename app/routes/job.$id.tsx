import {
  BodyShort,
  Box,
  HStack,
  Heading,
  Label,
  Page,
  VStack,
  Link,
  Button,
  BodyLong,
  List,
} from "@navikt/ds-react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchJobDetail } from "~/api/J_SEARCH/jobsApi";
import { JobDetail as JobDetailType } from "~/types/Job";
import { getMeta, truncateText } from "~/utils/utils";

export const meta: MetaFunction = () => getMeta("Job Detail");

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isLiveMode = url.searchParams.get("isLiveMode") === "true";

  if (!params || !params.id) {
    throw new Response("Not Found", { status: 404 });
  }

  const res = await fetchJobDetail(params.id, isLiveMode);
  if (!res) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ job: res as unknown as JobDetailType });
};
export default function JobDetail() {
  const { job } = useLoaderData<typeof loader>();

  return (
    <Page.Block as="main" className="about" width="md">
      <Box padding={{ xs: "3", sm: "4", md: "6", lg: "5" }}>
        <VStack gap="8">
          <VStack>
            <Box>
              <HStack gap="3" justify={"space-between"}>
                <Heading size="medium" level="1">
                  {job.job_title}
                </Heading>
              </HStack>
            </Box>
          </VStack>
          <VStack gap="5">
            <HStack gap="2">
              <Label>Employer: </Label>
              <BodyShort data-cy="employer-name">{job.employer_name}</BodyShort>
            </HStack>
            <HStack gap="2">
              <Label>Employer Website: </Label>
              <Link
                href={job.employer_website || ""}
                data-cy="employer-website"
              >
                {job.employer_website}
              </Link>
            </HStack>
            <HStack gap="2">
              <Label>Source: </Label>
              <Link href={job.job_google_link} data-cy="source-link">
                Google
              </Link>
            </HStack>

            <HStack gap="2">
              <Label>Description: </Label>
              <BodyLong data-cy="job-description">
                {truncateText(job.job_description)}{" "}
                <Link
                  onClick={() => alert("Not implemented yet. Come back later")}
                  href="#"
                  inlineText
                  variant="neutral"
                  data-cy="read-more-link"
                >
                  read more
                </Link>
              </BodyLong>
            </HStack>
            <HStack gap="2">
              <List
                as="ul"
                title="Qualifications"
                data-cy="qualifications-list"
              >
                {job.job_highlights?.Qualifications?.map((q, index) => (
                  <List.Item key={index}>{q}</List.Item>
                ))}
              </List>
            </HStack>
            <HStack gap="2" justify={"start"}>
              <Button
                as="a"
                href={job.job_apply_link || ""}
                data-cy="apply-link"
              >
                Apply here
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Page.Block>
  );
}
