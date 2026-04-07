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
    console.log(`📡 Checking cache for: ${username}`);

    // Step 1: Check if report exists in database (cache)
    const existingReport = await Report.findOne({ username }).sort({ createdAt: -1 });

    if (existingReport) {
      console.log(`✅ Found cached report for: ${username}`);
      // Return cached data with share URL
      return res.json({
        profile: existingReport.profile,
        repos: existingReport.repos || [],
        languages: existingReport.languages || [],
        topRepos: existingReport.topRepos || [],
        heatmapData: existingReport.heatmapData || [],
        scoring: existingReport.scoring,
        report: existingReport.report,
        shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/report/${username}`,
        cached: true,
        createdAt: existingReport.createdAt,
      });
    }

    console.log(`📡 No cache found, fetching GitHub data for: ${username}`);

    // Step 2: Fetch and structure GitHub data
    const githubData = await getCompleteGitHubData(username);

    // Step 3: Generate scoring evaluation
    console.log(`✅ GitHub data fetched, generating scores...`);
    const scoring = generateCompleteScore(githubData);

    // Step 4: Generate human-readable report
    const report = generateReport(scoring, githubData);

    // Step 5: Save evaluation to database
    try {
      const newReport = new Report({
        username,
        profile: githubData.profile,
        repos: githubData.repos,
        languages: githubData.languages,
        topRepos: githubData.topRepos,
        heatmapData: githubData.heatmapData,
        scoring,
        report,
      });
      await newReport.save();
      console.log(`✅ Report saved for user: ${username}`);
    } catch (dbError) {
      console.warn(`⚠️ Failed to save report to DB: ${dbError.message}`);
    }

    // Step 6: Return comprehensive response
    return res.json({
      profile: githubData.profile,
      repos: githubData.repos,
      languages: githubData.languages,
      topRepos: githubData.topRepos,
      heatmapData: githubData.heatmapData,
      scoring,
      report,
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/report/${username}`,
      cached: false,
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

const compareUsers = async (req, res) => {
  const { u1, u2 } = req.query;

  if (!u1 || !u2) {
    return res.status(400).json({ error: "Both usernames are required" });
  }

  try {
    console.log(`📡 Comparing users: ${u1} vs ${u2}`);

    // Helper function to get user data
    const getUserData = async (username) => {
      // Check cache first
      const existingReport = await Report.findOne({ username }).sort({ createdAt: -1 });
      if (existingReport) {
        return {
          profile: existingReport.profile,
          repos: existingReport.repos || [],
          languages: existingReport.languages || [],
          topRepos: existingReport.topRepos || [],
          heatmapData: existingReport.heatmapData || [],
          scoring: existingReport.scoring,
          report: existingReport.report,
          cached: true,
        };
      }

      // Fetch fresh data
      const githubData = await getCompleteGitHubData(username);
      const scoring = generateCompleteScore(githubData);
      const report = generateReport(scoring, githubData);

      // Save to cache
      try {
        const newReport = new Report({
          username,
          profile: githubData.profile,
          repos: githubData.repos,
          languages: githubData.languages,
          topRepos: githubData.topRepos,
          heatmapData: githubData.heatmapData,
          scoring,
          report,
        });
        await newReport.save();
      } catch (dbError) {
        console.warn(`⚠️ Failed to save report to DB: ${dbError.message}`);
      }

      return {
        profile: githubData.profile,
        repos: githubData.repos,
        languages: githubData.languages,
        topRepos: githubData.topRepos,
        heatmapData: githubData.heatmapData,
        scoring,
        report,
        cached: false,
      };
    };

    // Fetch data for both users
    const [user1Data, user2Data] = await Promise.all([
      getUserData(u1),
      getUserData(u2)
    ]);

    return res.json({
      user1: user1Data,
      user2: user2Data,
    });
  } catch (error) {
    console.error("❌ Error comparing users:", error.message);
    console.error("Full error:", error);

    if (error.status === 404) {
      return res.status(404).json({ error: "One or both GitHub users not found" });
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

module.exports = { getProfile, compareUsers };