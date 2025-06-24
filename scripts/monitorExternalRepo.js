require('dotenv').config();
const axios = require('axios');

// Set up external repository details
const EXTERNAL_REPO_OWNER = 'aayush2622'; // Replace with actual repo owner
const EXTERNAL_REPO = 'Dartotsu'; // Replace with actual repo name
const YOUR_REPO = 'grayankit/Dartotsu-Downloader'; // Your repository where the second workflow exists

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub token for authentication
const WORKFLOW_TRIGGER_URL = `https://api.github.com/repos/grayankit/Dartotsu-Downloader/actions/workflows/main.yml/dispatches`; // URL to trigger your second workflow

// Get the latest commits from the external repository
const getExternalRepoCommits = async () => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/aayush2622/Dartotsu/commits`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching commits:', error.message);
    return [];
  }
};

// Check if any commit matches the pattern `[build.*]`
const hasBuildCommit = (commits) => {
  return commits.some(commit => commit.commit.message.includes('[build.'));
};

// Trigger the second workflow
const triggerSecondWorkflow = async () => {
  try {
    const response = await axios.post(
      WORKFLOW_TRIGGER_URL,
      { ref: 'main' }, // Branch to trigger the workflow on
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    console.log('Second workflow triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering second workflow:', error.message);
  }
};

// Main function to monitor commits and trigger the second workflow
const monitorCommitsAndTriggerWorkflow = async () => {
  const commits = await getExternalRepoCommits();
  if (hasBuildCommit(commits)) {
    console.log('Detected build commit, triggering the second workflow...');
    await triggerSecondWorkflow();
  } else {
    console.log('No matching build commit found.');
  }
};

monitorCommitsAndTriggerWorkflow();
