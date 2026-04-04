import React, { useMemo, useState } from "react";
import "./RepoList.css";

const RepoList = ({ repos }) => {
  const [sortKey, setSortKey] = useState("stars");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedRepos = useMemo(() => {
    if (!repos || repos.length === 0) return [];

    return [...repos]
      .sort((a, b) => {
        const valueA = a[sortKey] ?? "";
        const valueB = b[sortKey] ?? "";

        if (sortKey === "language") {
          return sortOrder === "asc"
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA));
        }

        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      })
      .slice(0, 6);
  }, [repos, sortKey, sortOrder]);

  if (!repos || repos.length === 0) {
    return <p className="no-repos">No repositories found</p>;
  }

  return (
    <div className="repo-container">
      <div className="repo-top">
        <h2>Top Repositories</h2>
        <div className="repo-controls">
          <label>
            Sort by:
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="language">Language</option>
            </select>
          </label>
          <button
            className="sort-btn"
            onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
          >
            {sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
          </button>
        </div>
      </div>

      <div className="repo-grid">
        {sortedRepos.map((repo, index) => (
          <a
            key={repo.url || `${repo.name}-${index}`}
            className="repo-card"
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="repo-header">
              <h3>{repo.name}</h3>
              <span className="repo-language-badge">{repo.language || "N/A"}</span>
            </div>

            <p>{repo.description || "No description available"}</p>

            <div className="repo-stats">
              <span>⭐ {repo.stars ?? 0}</span>
              <span>🍴 {repo.forks ?? 0}</span>
            </div>

            <div className="repo-footer">
              <span className="view-button">View on GitHub</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RepoList;
