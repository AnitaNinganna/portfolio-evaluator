const { getCompleteGitHubData } = require("../services/githubService");
const {
  generateCompleteScore,
  generateReport,
} = require("../services/scoringService");
const Report = require("../models/Report");

const getProfile = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    console.log(`📡 Fetching GitHub data for: ${username}`);
    
    // Step 1: Fetch and structure GitHub data
    const githubData = await getCompleteGitHubData(username);

    // Step 2: Generate scoring evaluation
    console.log(`✅ GitHub data fetched, generating scores...`);
    const scoring = generateCompleteScore(githubData);

    // Step 3: Generate human-readable report
    const report = generateReport(scoring, githubData);

    // Step 4: Save evaluation to database (if MongoDB is connected)
    try {
      const newReport = new Report({
        username,
        profile: githubData.profile,
        scoring,
        report,
      });
      await newReport.save();
      console.log(`✅ Report saved for user: ${username}`);
    } catch (dbError) {
      // Log error but don't fail the API response
      console.warn(`⚠️ Failed to save report to DB: ${dbError.message}`);
    }

    // Step 5: Return comprehensive response
    return res.json({
      profile: githubData.profile,
      repos: githubData.repos,
      languages: githubData.languages,
      topRepos: githubData.topRepos,
      scoring,
      report,
    });
  } catch (error) {
    console.error("❌ Error fetching GitHub profile:", error.message);
    console.error("Full error:", error);
    
    if (error.status === 404) {
      return res.status(404).json({ error: "GitHub user not found" });
    }
    if (error.message.includes("Bad credentials")) {
      return res.status(401).json({ error: "Invalid GitHub token" });
    }
    if (error.message.includes("API rate limit")) {
      return res.status(429).json({ error: "GitHub API rate limit exceeded" });
    }
    
    return res.status(500).json({ error: "Server Error", details: error.message });
  }
};

module.exports = { getProfile };