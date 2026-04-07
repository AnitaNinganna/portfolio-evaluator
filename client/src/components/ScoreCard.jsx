import React, { useState, useEffect } from 'react';
import './ScoreCard.css';

const ScoreCard = ({ score = 0, scoringData = {}, isWinner = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setAnimateScore(true);
  }, []);

  // Ensure score is between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  // Calculate the circumference and stroke offset for the progress circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = animateScore ? circumference - (normalizedScore / 100) * circumference : circumference;

  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return '#2ecc71'; // Green
    if (score >= 60) return '#3498db'; // Blue
    if (score >= 40) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  };

  // Determine tier based on score
  const getTier = (score) => {
    if (score >= 90) return 'Expert';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Proficient';
    if (score >= 60) return 'Intermediate';
    if (score >= 50) return 'Developing';
    return 'Beginner';
  };

  const tier = getTier(normalizedScore);
  const scoreColor = getScoreColor(normalizedScore);

  // Extract breakdown data
  const portfolio = scoringData?.portfolio || {};
  const profile = scoringData?.profile || {};
  const diversity = scoringData?.diversity || {};

  return (
    <div className={`score-card ${isWinner ? 'winner' : ''}`}>
      <div className="score-card-content">
        <div className="circular-progress">
          <svg width="150" height="150" viewBox="0 0 150 150">
            {/* Background circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 75 75)"
              className="progress-circle"
            />
          </svg>
          <div className="score-text">
            <span className="score-number">{normalizedScore.toFixed(1)}</span>
            <span className="score-label">/100</span>
          </div>
        </div>
        <div className="score-description">
          <h3>Portfolio Score</h3>
          <p className={`score-rating rating-${tier.toLowerCase()}`}>
            {tier.toUpperCase()}
          </p>
          <button 
            className={`expand-button ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title="View score breakdown"
          >
            <span className="expand-icon">⬇</span>
          </button>
        </div>
      </div>

      {/* Expandable Breakdown Section */}
      <div className={`score-breakdown ${isExpanded ? 'visible' : 'hidden'}`}>
        <div className="breakdown-grid">
          {/* Portfolio Score */}
          {portfolio.portfolioScore !== undefined && (
            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">Repository Quality</span>
                <span className="breakdown-icon">📦</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill" 
                  style={{ 
                    width: `${Math.min(portfolio.portfolioScore, 100)}%`,
                    backgroundColor: getScoreColor(portfolio.portfolioScore)
                  }}
                />
              </div>
              <span className="breakdown-value">{portfolio.portfolioScore}/100</span>
              {portfolio.consistency !== undefined && (
                <div className="breakdown-sub">
                  <span className="sub-label">Consistency:</span>
                  <span className="sub-value">{portfolio.consistency}%</span>
                </div>
              )}
              {portfolio.averageQuality !== undefined && (
                <div className="breakdown-sub">
                  <span className="sub-label">Avg Quality:</span>
                  <span className="sub-value">{portfolio.averageQuality}/100</span>
                </div>
              )}
            </div>
          )}

          {/* Profile Score */}
          {profile.profileScore !== undefined && (
            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">Profile Strength</span>
                <span className="breakdown-icon">👤</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill" 
                  style={{ 
                    width: `${Math.min(profile.profileScore, 100)}%`,
                    backgroundColor: getScoreColor(profile.profileScore)
                  }}
                />
              </div>
              <span className="breakdown-value">{profile.profileScore}/100</span>
              {profile.breakdown && (
                <>
                  <div className="breakdown-sub">
                    <span className="sub-label">Followers:</span>
                    <span className="sub-value">+{profile.breakdown.followers}</span>
                  </div>
                  <div className="breakdown-sub">
                    <span className="sub-label">Experience:</span>
                    <span className="sub-value">+{profile.breakdown.experience}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Language Diversity Score */}
          {diversity.diversityScore !== undefined && (
            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">Skill Diversity</span>
                <span className="breakdown-icon">🎯</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill" 
                  style={{ 
                    width: `${Math.min(diversity.diversityScore, 100)}%`,
                    backgroundColor: getScoreColor(diversity.diversityScore)
                  }}
                />
              </div>
              <span className="breakdown-value">{diversity.diversityScore}/100</span>
              {diversity.languageCount !== undefined && (
                <div className="breakdown-sub">
                  <span className="sub-label">Languages:</span>
                  <span className="sub-value">{diversity.languageCount}</span>
                </div>
              )}
              {diversity.primaryLanguage && (
                <div className="breakdown-sub">
                  <span className="sub-label">Primary:</span>
                  <span className="sub-value">{diversity.primaryLanguage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="score-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#2ecc71' }}></span>
            <span>80-100: Excellent</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#3498db' }}></span>
            <span>60-79: Good</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
            <span>40-59: Fair</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#e74c3c' }}></span>
            <span>0-39: Needs Work</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTier = (score) => {
  if (score >= 90) return 'Expert';
  if (score >= 80) return 'Advanced';
  if (score >= 70) return 'Proficient';
  if (score >= 60) return 'Intermediate';
  if (score >= 50) return 'Developing';
  return 'Beginner';
};

export default ScoreCard;
