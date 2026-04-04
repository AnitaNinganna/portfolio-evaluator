const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// STEP 2: Fetch User Profile
const getUserProfile = async (username) => {
  const { data } = await octokit.users.getByUsername({ username });

  return {
    username: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    followers: data.followers,
    publicRepos: data.public_repos,
    blog: data.blog,
    email: data.email,
    createdAt: data.created_at,
  };
};

// STEP 3: Fetch Repositories
const getUserRepos = async (username) => {
  const { data } = await octokit.repos.listForUser({
    username,
    per_page: 100,
    sort: "updated",
  });

  return data;
};

// STEP 4: Extract Important Repo Data
const extractRepoData = (repos) => {
  return repos.map((repo) => ({
    name: repo.name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics || [],
    hasLicense: !!repo.license,
    hasReadme: true, // assume for now (we improve later)
    url: repo.html_url,
    description: repo.description,
  }));
};

// STEP 5: Get Language Distribution
const getLanguageStats = (repos) => {
  const langCount = {};

  repos.forEach((repo) => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  });

  const total = Object.values(langCount).reduce((a, b) => a + b, 0);

  return Object.entries(langCount).map(([name, count]) => ({
    name,
    percent: ((count / total) * 100).toFixed(2),
  }));
};

// STEP 6: Get Top Repositories
const getTopRepos = (repos) => {
  return repos.sort((a, b) => b.stars - a.stars).slice(0, 6);
};

// STEP 7: Fetch Public Events and Build Heatmap
const getUserEvents = async (username, perPage = 100) => {
  const { data } = await octokit.activity.listPublicEventsForUser({
    username,
    per_page: perPage,
  });
  return data;
};

const buildHeatmapData = (events, days = 90) => {
  const heatmap = {};
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (days - 1));

  for (let i = 0; i < days; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = date.toISOString().split("T")[0];
    heatmap[key] = 0;
  }

  events.forEach((event) => {
    if (event.type !== "PushEvent") return;
    const date = event.created_at.split("T")[0];
    if (!(date in heatmap)) return;
    const commitCount = event.payload?.commits?.length || 0;
    heatmap[date] += commitCount;
  });

  return Object.keys(heatmap)
    .sort()
    .map((date) => ({ date, count: heatmap[date] }));
};

// STEP 8: Combine Everything
const getCompleteGitHubData = async (username) => {
  const profile = await getUserProfile(username);
  const reposRaw = await getUserRepos(username);
  const events = await getUserEvents(username);

  const repos = extractRepoData(reposRaw);
  const languages = getLanguageStats(repos);
  const topRepos = getTopRepos(repos);
  const heatmapData = buildHeatmapData(events, 90);
  const contributions = heatmapData.reduce((sum, day) => sum + day.count, 0);

  return {
    profile: {
      ...profile,
      contributions,
    },
    repos,
    languages,
    topRepos,
    heatmapData,
  };
};

// STEP 8: Export Functions
module.exports = {
  getCompleteGitHubData,
  getUserProfile,
  getUserRepos,
  extractRepoData,
  getLanguageStats,
  getTopRepos,
};