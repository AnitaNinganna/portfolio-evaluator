import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import './Report.css';

const Report = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/profile/${username}`);
        setReport(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchReport();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="report-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <div className="loading-spinner">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const profile = report?.profile;

  return (
    <div className="report-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Home
      </button>

      {profile && (
        <div className="report-content">
          <div className="profile-header">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name || profile.username}
              className="avatar"
            />
            <div className="profile-info">
              <h1>{profile.name || profile.username}</h1>
              <p className="username">@{profile.username}</p>
              {profile.bio && <p className="bio">{profile.bio}</p>}
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-label">Followers</span>
              <span className="stat-value">{profile.followers}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Public Repos</span>
              <span className="stat-value">{profile.publicRepos}</span>
            </div>
          </div>

          <div className="report-sections">
            {report?.scoring && (
              <div className="report-section">
                <h2>Overall Score</h2>
                <div className="score-container">
                  <p className="score-value">{report.scoring.overallScore.toFixed(1)}/100</p>
                </div>
              </div>
            )}

            {report?.topRepos && report.topRepos.length > 0 && (
              <div className="report-section">
                <h2>Top Repositories</h2>
                <div className="repos-grid">
                  {report.topRepos.map((repo, idx) => (
                    <a
                      key={idx}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-card"
                    >
                      <h3>{repo.name}</h3>
                      <p>{repo.description || 'No description'}</p>
                      <div className="repo-meta">
                        {repo.language && <span className="lang">{repo.language}</span>}
                        <span className="stars">⭐ {repo.stars}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {report?.report && (
              <div className="report-section">
                <h2>Detailed Report</h2>
                <div className="report-text">{report.report}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
