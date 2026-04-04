import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import ScoreCard from '../components/ScoreCard';
import RadarChart from '../components/RadarChart';
import LanguageBarChart from '../components/LanguageBarChart';
import RepoList from '../components/RepoList';
import HeatMap from '../components/HeatMap';
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
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to load report'
        );
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
            <div className="stat">
              <span className="stat-label">Total Stars</span>
              <span className="stat-value">{profile.totalStars || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Contributions</span>
              <span className="stat-value">{profile.contributions || 0}</span>
            </div>
          </div>

          <div className="report-sections">
            {report?.scoring && (
              <div className="report-section score-section">
                <ScoreCard 
                  score={report.scoring.overall?.score || report.scoring.overallScore} 
                  scoringData={report.scoring}
                />
              </div>
            )}

            {report?.scoring && (
              <div className="report-section charts-section">
                <h2>Portfolio Scores Breakdown</h2>
                <RadarChart 
                  scores={{
                    activity: report.scoring.activity || 0,
                    codeQuality: report.scoring.codeQuality || 0,
                    diversity: report.scoring.diversity || 0,
                    community: report.scoring.community || 0,
                    hiringReadiness: report.scoring.hiringReadiness || 0,
                  }}
                />
              </div>
            )}

            {report?.languages && report.languages.length > 0 && (
              <div className="report-section charts-section">
                <h2>Language Distribution</h2>
                <LanguageBarChart languages={report.languages} />
              </div>
            )}

            {report?.topRepos && (
              <div className="report-section">
                <RepoList repos={report.topRepos} />
              </div>
            )}

            {report?.heatmapData && report.heatmapData.length > 0 && (
              <div className="report-section">
                <HeatMap data={report.heatmapData} />
              </div>
            )}

            {report?.report && (
              <div className="report-section">
                <h2>Detailed Report</h2>
                <div className="report-text">{report.report}</div>
              </div>
            )}

            {report?.scoring && (
              <div className="report-section recommendations-section">
                <h2>Recommendations</h2>
                <div className="recommendations">
                  {report.scoring.activity < 60 && (
                    <div className="recommendation">
                      <h3>🚀 Boost Activity</h3>
                      <p>Increase your GitHub activity by contributing regularly to open-source projects or maintaining your own repositories.</p>
                    </div>
                  )}
                  {report.scoring.codeQuality < 60 && (
                    <div className="recommendation">
                      <h3>💻 Improve Code Quality</h3>
                      <p>Focus on writing clean, well-documented code. Use linters, write tests, and follow best practices.</p>
                    </div>
                  )}
                  {report.scoring.diversity < 60 && (
                    <div className="recommendation">
                      <h3>🌍 Increase Language Diversity</h3>
                      <p>Explore new programming languages and technologies to broaden your skill set.</p>
                    </div>
                  )}
                  {report.scoring.community < 60 && (
                    <div className="recommendation">
                      <h3>🤝 Build Community</h3>
                      <p>Engage with the developer community through issues, pull requests, and discussions.</p>
                    </div>
                  )}
                  {report.scoring.hiringReadiness < 60 && (
                    <div className="recommendation">
                      <h3>📋 Enhance Hiring Readiness</h3>
                      <p>Update your profile with a professional bio, pin important repositories, and highlight your achievements.</p>
                    </div>
                  )}
                  {report.scoring.activity >= 80 && report.scoring.codeQuality >= 80 && (
                    <div className="recommendation positive">
                      <h3>🎉 Excellent Portfolio!</h3>
                      <p>Your portfolio demonstrates strong technical skills and activity. Keep up the great work!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
