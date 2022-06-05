import { getInput, info, setFailed, setOutput } from "@actions/core";
import { getOctokit } from "@actions/github";
import dateFormat, { masks } from "dateformat";
import { dateDiff, calcTimeUnits } from "./dateutils.js";

async function run() {
  try {
    const token = getInput("token", { required: true, trimWhitespace: true });
    const owner = getInput("owner", { required: true, trimWhitespace: true });
    const repo = getInput("repo", { required: true, trimWhitespace: true });
    const days_old = getInput("days_old", {
      required: false,
      trimWhitespace: true,
    });

    const numDaysOldToBeDeleted = Number(days_old || 7);
    var filterDate = new Date();
    info(`today:  ${dateFormat(filterDate, "yyyy-mm-dd")}`);
    filterDate.setDate(filterDate.getDate() - numDaysOldToBeDeleted)
    info(`search: ${dateFormat(filterDate, "yyyy-mm-dd")}`);

    /**
     * https://octokit.github.io/rest.js/v18
     **/
    const octokit = new getOctokit(token);

    octokit.paginate(octokit.rest.actions.listWorkflowRunsForRepo,
      {
        owner,
        repo,
        status: "completed",
        per_page: 10,
      }
    ).then((data) => {
      info(`total of ${data.length} workflows found`);
      info(`${workflowRunsToDelete.length} workflow runs to be deleted`);

    });
/*
    if (workflowRunsToDelete.length > 0) {
      info(`${requests.length} workflow runs successfully deleted`);

      const deleteRunAction = ({ id }) => {
        info(`Deleting workflow run #${id}`);

        return octokit.rest.actions
          .deleteWorkflowRun({ owner, repo, run_id: id })
          .catch((err) => `An error occurred: ${err.message}`);
      };

      const requests = await Promise.all(
        workflowRunsToDelete.map(deleteRunAction)
      );

      info(`${requests.length} workflow runs successfully deleted`);

      setOutput(
        "result",
        `${requests.length} workflow runs successfully deleted`
      );
    }
*/
  } catch (error) {
    setFailed(error.message);
  }
}

run();
