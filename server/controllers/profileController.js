const { getCompleteGitHubData } = require("../services/githubService");
const {
  generateCompleteScore,
  generateReport,
} = require("../services/scoringService");

const getProfile = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // Step 1: Fetch and structure GitHub data
    const githubData = await getCompleteGitHubData(username);

    // Step 2: Generate scoring evaluation
    const scoring = generateCompleteScore(githubData);

    // Step 3: Generate human-readable report
    const report = generateReport(scoring, githubData);

    // Step 4: Return comprehensive response
    return res.json({
      profile: githubData.profile,
      repos: githubData.repos,
      languages: githubData.languages,
      topRepos: githubData.topRepos,
      scoring,
      report,
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