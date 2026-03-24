const { getUser } = require("../services/githubService");

const getProfile = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const profileData = await getUser(username);

    // Also fetch repos using Octokit
    const { Octokit } = require("@octokit/rest");
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const reposResponse = await octokit.repos.listForUser({
      username,
      sort: "updated",
      per_page: 10,
    });

    const reposData = reposResponse.data;

    return res.json({
      profile: profileData,
      repos: reposData,
    });
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    if (error.status === 404) {
      return res.status(404).json({ error: "GitHub user not found" });
    }
    return res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getProfile };

module.exports = { getProfile };