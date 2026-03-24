const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const getUser = async (username) => {
  const { data } = await octokit.users.getByUsername({ username });
  return data;
};

module.exports = { getUser };