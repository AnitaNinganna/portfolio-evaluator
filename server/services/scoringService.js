// ============================================
// SCORING SERVICE - Portfolio Evaluation Logic
// ============================================
// Converts structured GitHub data into meaningful scores
// Each function is independent and testable

// STEP 1: Score Individual Repositories
// Evaluates: stars, forks, language, documentation
const scoreRepository = (repo) => {
  let repoScore = 0;

  // Star scoring (max 30 points)
  // Logic: More stars = higher quality signal
  const starScore =
    repo.stars === 0
      ? 0
      : Math.min(30, Math.log10(repo.stars + 1) * 10);

  // Fork scoring (max 20 points)
  // Logic: Forks indicate community interest
  const forkScore =
    repo.forks === 0
      ? 0
      : Math.min(20, Math.log10(repo.forks + 1) * 7);

  // Language scoring (max 15 points)
  // Logic: In-demand languages get bonus
  const inDemandLanguages = [
    "TypeScript",
    "Python",
    "Go",
    "Rust",
    "JavaScript",
  ];
  const langScore = inDemandLanguages.includes(repo.language) ? 15 : 10;

  // Documentation scoring (max 20 points)
  const descScore = repo.description && repo.description.length > 20 ? 15 : 5;
  const readmeScore = repo.hasReadme ? 10 : 0;
  const licenseScore = repo.hasLicense ? 10 : 0;

  // Topics scoring (max 10 points)
  const topicScore = repo.topics.length > 0 ? Math.min(10, repo.topics.length * 2) : 0;

  repoScore =
    starScore +
    forkScore +
    langScore +
    descScore +
    readmeScore +
    licenseScore +
    topicScore;

  return {
    name: repo.name,
    score: Math.round(repoScore),
    breakdown: {
      stars: Math.round(starScore),
      forks: Math.round(forkScore),
      language: langScore,
      description: descScore,
      readme: readmeScore,
      license: licenseScore,
      topics: topicScore,
    },
  };
};

// STEP 2: Score Repository Portfolio
// Evaluates: quality, consistency, diversity
const scoreRepositoryPortfolio = (repos) => {
  if (repos.length === 0) {
    return {
      portfolioScore: 0,
      averageQuality: 0,
      topRepositories: [],
      consistency: 0,
    };
  }

  // Score each repo
  const repoScores = repos.map(scoreRepository);

  // Calculate averages
  const totalScore = repoScores.reduce((sum, r) => sum + r.score, 0);
  const averageQuality = Math.round(totalScore / repoScores.length);

  // Consistency score (variance in repo quality)
  // Lower variance = higher consistency = better
  const variance =
    repoScores.reduce(
      (sum, r) => sum + Math.pow(r.score - averageQuality, 2),
      0
    ) / repoScores.length;
  const consistency = Math.max(0, 100 - variance / 10);

  // Portfolio score (combined metric)
  // 40% average quality + 30% consistency + 30% best repos
  const topReposScore =
    repoScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .reduce((sum, r) => sum + r.score, 0) / 3;

  const portfolioScore = Math.round(
    averageQuality * 0.4 + consistency * 0.3 + topReposScore * 0.3
  );

  return {
    portfolioScore,
    averageQuality,
    consistency: Math.round(consistency),
    repoScores: repoScores.sort((a, b) => b.score - a.score),
  };
};

// STEP 3: Score Developer Profile
// Evaluates: experience, community engagement, presence
const scoreProfile = (profile, repoCount) => {
  let profileScore = 0;

  // Followers scoring (max 20 points)
  const followerScore = Math.min(
    20,
    Math.log10(profile.followers + 1) * 5
  );

  // Public repos scoring (max 25 points)
  // Shows prolific output
  const repoScore = Math.min(25, Math.log10(repoCount + 1) * 8);

  // Account age scoring (max 20 points)
  // More experienced developers
  const accountAge =
    (new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24 * 365);
  const ageScore = Math.min(20, accountAge * 2);

  // Presence scoring (max 15 points)
  // Profile completeness
  let presenceScore = 0;
  if (profile.name) presenceScore += 5;
  if (profile.bio && profile.bio.length > 10) presenceScore += 5;
  if (profile.blog) presenceScore += 5;
  presenceScore = Math.min(15, presenceScore);

  profileScore =
    followerScore + repoScore + ageScore + presenceScore;

  return {
    profileScore: Math.round(profileScore),
    breakdown: {
      followers: Math.round(followerScore),
      repos: Math.round(repoScore),
      experience: Math.round(ageScore),
      presence: presenceScore,
    },
  };
};

// STEP 4: Score Language Diversity
// Evaluates: skill breadth
const scoreLanguageDiversity = (languages) => {
  if (languages.length === 0) {
    return {
      diversityScore: 0,
      languageCount: 0,
      primaryLanguage: null,
    };
  }

  // Base score: more languages = better
  const languageCountScore = Math.min(
    20,
    languages.length * 2
  );

  // Evenness score: balanced languages > one dominant
  // Herfindahl Index (0 = perfectly balanced, 1 = single language)
  const herfindahl = languages.reduce(
    (sum, lang) => sum + Math.pow(parseFloat(lang.percent) / 100, 2),
    0
  );
  const evenness = (1 - herfindahl) * 15; // max 15 points

  // Specialization bonus: depth in specific domains
  const specializedLangs = {
    backend: ["Python", "Go", "Java", "C#", "Ruby"],
    frontend: ["JavaScript", "TypeScript", "React"],
    systems: ["C", "C++", "Rust", "Go"],
    data: ["Python", "R", "SQL"],
  };

  let specializationScore = 0;
  for (const domain of Object.values(specializedLangs)) {
    const match = languages.some(lang =>
      domain.includes(lang.name)
    );
    if (match) specializationScore += 5;
  }
  specializationScore = Math.min(15, specializationScore);

  const diversityScore = Math.round(
    languageCountScore + evenness + specializationScore
  );

  return {
    diversityScore,
    languageCount: languages.length,
    primaryLanguage: languages[0]?.name || null,
    breakdown: {
      languageCount: languageCountScore,
      evenness: Math.round(evenness),
      specialization: specializationScore,
    },
  };
};

// STEP 5: Combine All Scores
// Returns comprehensive portfolio evaluation
const generateCompleteScore = (githubData) => {
  // Score each component
  const portfolio = scoreRepositoryPortfolio(githubData.repos);
  const profile = scoreProfile(githubData.profile, githubData.repos.length);
  const diversity = scoreLanguageDiversity(githubData.languages);

  // Weighted final score
  // 40% repository quality + 35% profile strength + 25% language diversity
  const overallScore = Math.round(
    portfolio.portfolioScore * 0.4 +
      profile.profileScore * 0.35 +
      diversity.diversityScore * 0.25
  );

  // Determine tier/level
  let tier = "Beginner";
  if (overallScore >= 80) tier = "Expert";
  else if (overallScore >= 60) tier = "Advanced";
  else if (overallScore >= 40) tier = "Intermediate";

  return {
    overall: {
      score: Math.min(100, overallScore), // cap at 100
      tier,
      percentile: Math.round(overallScore / 100 * 100), // simplified percentile
    },
    portfolio,
    profile,
    diversity,
    summary: {
      totalRepos: githubData.repos.length,
      topLanguage: diversity.primaryLanguage,
      followers: githubData.profile.followers,
      topRepo: portfolio.repoScores[0]?.name,
      topRepoScore: portfolio.repoScores[0]?.score,
    },
  };
};

// STEP 6: Generate Report
// Creates human-readable evaluation
const generateReport = (completeScore, githubData) => {
  const profile = githubData.profile;

  // Strengths
  const strengths = [];
  if (completeScore.portfolio.portfolioScore > 60)
    strengths.push("Strong repository portfolio");
  if (completeScore.profile.breakdown.followers > 10)
    strengths.push("Good community engagement");
  if (completeScore.diversity.languageCount > 3)
    strengths.push("Diverse skill set");
  if (completeScore.portfolio.consistency > 70)
    strengths.push("Consistent code quality");

  // Areas for improvement
  const improvements = [];
  if (completeScore.portfolio.portfolioScore < 40)
    improvements.push("Focus on quality over quantity in repositories");
  if (completeScore.diversity.languageCount < 2)
    improvements.push("Expand to learn additional programming languages");
  if (!profile.bio)
    improvements.push("Add a compelling bio to your profile");
  if (completeScore.profile.breakdown.presence < 10)
    improvements.push("Complete your GitHub profile details");

  return {
    strengths: strengths.length > 0 ? strengths : ["Starting your journey!"],
    improvements: improvements.length > 0 ? improvements : ["Keep up the great work!"],
    nextSteps: [
      "Focus on creating well-documented projects",
      "Increase visibility by contributing to open source",
      "Build projects in high-demand languages",
    ],
  };
};

// STEP 7: Export All Functions
module.exports = {
  scoreRepository,
  scoreRepositoryPortfolio,
  scoreProfile,
  scoreLanguageDiversity,
  generateCompleteScore,
  generateReport,
};
