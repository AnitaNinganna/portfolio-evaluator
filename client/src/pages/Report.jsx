import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import ScoreCard from "../components/ScoreCard";
import RadarChart from "../components/RadarChart";
import RepoList from "../components/RepoList";
import HeatMap from "../components/HeatMap";
import LanguageBarChart from "../components/LanguageBarChart";
import "./Report.css";

const Report = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [copyLoading, setCopyLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // ✅ Fetch Data
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get(`/profile/${username}`);
      console.log("API Response:", res.data);

      setReport(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchReport();
    }
  }, [username]);

  // ✅ Retry
  const handleRetry = () => {
    fetchReport();
  };

  // ✅ Copy Link with Enhanced UX
  const handleCopyLink = async () => {
    const url = window.location.href;
    setCopyLoading(true);
    setCopySuccess('');

    try {
      // Modern browsers with secure context
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setCopySuccess('✅ Link copied successfully!');
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        let successful = false;
        try {
          successful = document.execCommand('copy');
        } catch (execError) {
          console.warn('execCommand failed:', execError);
        }

        document.body.removeChild(textArea);

        if (successful) {
          setCopySuccess('✅ Link copied successfully!');
        } else {
          throw new Error('Fallback copy method failed');
        }
      }

      // Clear success message after 3 seconds
      setTimeout(() => setCopySuccess(''), 3000);

    } catch (err) {
      console.error('Copy failed:', err);

      // Provide specific error messages based on the error type
      if (err.name === 'NotAllowedError') {
        setCopySuccess('❌ Copy blocked by browser. Please allow clipboard access.');
      } else if (!navigator.clipboard) {
        setCopySuccess('❌ Clipboard not supported. Please copy the URL manually.');
      } else {
        setCopySuccess('❌ Copy failed. Please try again or copy manually.');
      }

      // Clear error message after 4 seconds
      setTimeout(() => setCopySuccess(''), 4000);
    } finally {
      setCopyLoading(false);
    }
  };

  // ✅ Handle tooltip visibility
  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  // ================= UI =================

  if (loading) {
    return (
      <div className="report-container">
        <p>Loading {username}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-container">
        <p>No data found for {username}</p>
        <button onClick={handleRetry}>Retry</button>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );
  }

  // ✅ Safe Data Access with validation
  const profile = report.profile || {};
  const scoring = report.scoring || {};
  const displayUsername = profile.username || profile.login || report.username || username;

  // Validate that we have the minimum required data
  if (!displayUsername) {
    return (
      <div className="report-container">
        <h2>Incomplete Data</h2>
        <p>Profile data is missing for {username}</p>
        <button onClick={handleRetry}>Retry</button>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );
  }

  const metricCards = [
    { label: 'Followers', value: profile.followers || 0 },
    { label: 'Public Repos', value: profile.publicRepos || 0 },
    { label: 'Total Stars', value: profile.totalStars || 0 },
    { label: 'Contributions (Last Year)', value: profile.contributions || 0 },
  ];

  const recommendations = [
    {
      title: '🚀 Boost Your Streak',
      description: 'Keep your commit cadence consistent to show sustained activity and momentum.',
      signal: 'Signal: Longest Streak (15 days)',
    },
    {
      title: '💻 Improve Repository Quality',
      description: 'Add README details and polish top projects to make them recruiter-ready.',
      signal: 'Signal: Repos with low documentation',
    },
    {
      title: '🤝 Engage the Community',
      description: 'Contribute to issues, PRs, and discussions to improve visibility and reputation.',
      signal: 'Signal: Community activity is below target',
    },
  ];

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="report-header-left">
          <div>
            <span className="report-tag">Portfolio Report</span>
            <h1>{profile.name || displayUsername || 'No Name'}</h1>
            <p className="report-subtitle">@{displayUsername}</p>
          </div>
        </div>
        <div className="report-header-actions">
          <button className="compare-button">Compare Mode</button>
          <div className="copy-link-container">
            <button
              onClick={handleCopyLink}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              disabled={copyLoading}
              className={`copy-link-button ${copyLoading ? 'copy-loading' : ''} ${copySuccess.includes('✅') ? 'copy-success' : ''}`}
              aria-label={`Copy report link to clipboard. Current URL: ${window.location.href}`}
              title="Click to copy this report's URL to your clipboard"
            >
              {copyLoading ? (
                <span className="copy-spinner">⏳</span>
              ) : copySuccess.includes('✅') ? (
                <span className="copy-check">✅</span>
              ) : (
                <span className="copy-icon">📋</span>
              )}
              <span className="copy-text">
                {copyLoading ? 'Copying...' : copySuccess.includes('✅') ? 'Copied!' : 'Copy Report Link'}
              </span>
            </button>
            {showTooltip && !copyLoading && (
              <div className="copy-tooltip">
                <div className="tooltip-url">{window.location.href}</div>
                <div className="tooltip-hint">Click to copy this URL</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-summary-card">
        <div className="profile-summary-left">
          <img
            src={profile.avatarUrl || 'https://via.placeholder.com/150'}
            alt="avatar"
            className="avatar"
          />
          <div className="profile-info">
            <h2>{profile.name || displayUsername || 'No Name'}</h2>
            <p className="username">@{displayUsername}</p>
            <p className="bio">{profile.bio || 'No bio available'}</p>
          </div>
        </div>
        <div className="profile-summary-right">
          <div className="profile-quick-stats">
            <div>
              <span>Followers</span>
              <strong>{profile.followers || 0}</strong>
            </div>
            <div>
              <span>Repos</span>
              <strong>{profile.publicRepos || 0}</strong>
            </div>
            <div>
              <span>Stars</span>
              <strong>{profile.totalStars || 0}</strong>
            </div>
          </div>
          <div className="share-copy-note">
            {copySuccess ? (
              <div className={`copy-feedback ${copySuccess.includes('❌') ? 'copy-error' : 'copy-success'}`}>
                {copySuccess}
              </div>
            ) : report.cached ? (
              <div className="cache-indicator">📊 Loaded from cache</div>
            ) : (
              <div className="share-hint">
                💡 Share this report with your team or on LinkedIn
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="metric-card-grid">
        {metricCards.map((metric) => (
          <div key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value.toLocaleString()}</strong>
          </div>
        ))}
      </div>

      <div className="report-sections">
        <section className="report-section score-overview">
          <div className="section-title-row">
            <h2>Portfolio Scores Overview</h2>
            <p>Track your overall profile strength and performance breakdown.</p>
          </div>
          <div className="score-layout">
            <div className="score-card-panel">
              {scoring.overall ? (
                <ScoreCard score={scoring.overall.score || 0} scoringData={scoring} />
              ) : (
                <div className="empty-state-card">Score details unavailable</div>
              )}
            </div>
            <div className="radar-card-panel">
              {scoring.portfolio && scoring.profile && scoring.diversity ? (
                <RadarChart
                  scores={{
                    activity: scoring.portfolio.portfolioScore || 0,
                    codeQuality: scoring.portfolio.averageQuality || 0,
                    diversity: scoring.diversity.diversityScore || 0,
                    community: scoring.profile.profileScore || 0,
                    hiringReadiness: scoring.profile.presence || 0,
                  }}
                />
              ) : (
                <div className="empty-state-card">Radar visualization unavailable</div>
              )}
            </div>
          </div>
        </section>

        <section className="report-section insights-section">
          <div className="section-title-row">
            <h2>Deep Data Insights</h2>
            <p>Language distribution and contribution pattern provide a better picture of your activity.</p>
          </div>
          <div className="insights-grid">
            <div className="chart-card">
              <h3>Language Distribution</h3>
              {Array.isArray(report.languages) && report.languages.length > 0 ? (
                <LanguageBarChart languages={report.languages} />
              ) : (
                <div className="empty-state-card">No language data available</div>
              )}
            </div>
            <div className="chart-card heatmap-card">
              <div className="heatmap-header">
                <h3>Contribution Heatmap</h3>
                <span className="heatmap-legend">Less &nbsp;•&nbsp; More</span>
              </div>
              {Array.isArray(report.heatmapData) && report.heatmapData.length > 0 ? (
                <HeatMap data={report.heatmapData} />
              ) : (
                <div className="empty-state-card">No heatmap data available</div>
              )}
            </div>
          </div>
        </section>

        <section className="report-section top-repos-section">
          <div className="section-title-row">
            <h2>Top Repositories (by Stars)</h2>
            <p>Highlighted repositories with the strongest performance and community appeal.</p>
          </div>
          {Array.isArray(report.topRepos) && report.topRepos.length > 0 ? (
            <RepoList repos={report.topRepos} />
          ) : (
            <div className="empty-state-card">No repositories available</div>
          )}
        </section>

        <section className="report-section recommendations-section">
          <div className="section-title-row">
            <h2>Strategic Recommendations for {profile.name || displayUsername}</h2>
            <p>Actionable next steps to improve visibility, quality, and community presence.</p>
          </div>
          <div className="recommendations-grid">
            {recommendations.map((item) => (
              <div key={item.title} className="recommendation-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="related-signal">{item.signal}</span>
              </div>
            ))}
          </div>
        </section>

        {report.report && (
          <section className="report-section report-summary-section">
            <div className="section-title-row">
              <h2>Detailed Report Summary</h2>
            </div>
            <div className="report-text">{report.report}</div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Report;