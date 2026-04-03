import React from "react";
import "./RepoList.css";

const RepoList = ({ repos }) => {
  if (!repos || repos.length === 0) {
    return <p className="no-repos">No repositories found</p>;
  }

  return (
    <div className="repo-container">
      <h2>Top Repositories</h2>
      <div className="repo-grid">
        {repos.slice(0, 6).map((repo, index) => (
          <div key={repo.url || `${repo.name}-${index}`} className="repo-card">
            <div className="repo-header">
              <h3>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h3>
              <a
                className="view-button"
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </div>

            <p>{repo.description || "No description available"}</p>

            <div className="repo-stats">
              <span>⭐ {repo.stars ?? 0}</span>
              <span>🍴 {repo.forks ?? 0}</span>
              <span className="repo-language">💻 {repo.language || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoList;
