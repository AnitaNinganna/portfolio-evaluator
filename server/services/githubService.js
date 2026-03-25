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

// STEP 7: Combine Everything
const getCompleteGitHubData = async (username) => {
  const profile = await getUserProfile(username);
  const reposRaw = await getUserRepos(username);

  const repos = extractRepoData(reposRaw);
  const languages = getLanguageStats(repos);
  const topRepos = getTopRepos(repos);

  return {
    profile,
    repos,
    languages,
    topRepos,
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