const getProfile = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const profileResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: {
        "User-Agent": "Portfolio-Evaluator",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (profileResponse.status === 404) {
      return res.status(404).json({ error: "GitHub user not found" });
    }

    if (!profileResponse.ok) {
      const errorBody = await profileResponse.text();
      return res.status(profileResponse.status).json({ error: "GitHub API error", details: errorBody });
    }

    const profileData = await profileResponse.json();

    const reposResponse = await fetch(profileData.repos_url, {
      headers: {
        "User-Agent": "Portfolio-Evaluator",
        Accept: "application/vnd.github.v3+json",
      },
    });

    const reposData = reposResponse.ok ? await reposResponse.json() : [];

    return res.json({
      profile: profileData,
      repos: reposData,
    });
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getProfile };