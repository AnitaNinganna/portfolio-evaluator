import React, { useState } from 'react';
import API from '../utils/api';
import ScoreCard from '../components/ScoreCard';
import RadarChart from '../components/RadarChart';
import './Compare.css';

const Compare = () => {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!user1.trim() || !user2.trim()) {
      setError('Please enter both usernames');
      return;
    }

    setLoading(true);
    setError('');
    setComparisonData(null);

    try {
      const response = await API.get(`/compare?u1=${user1.trim()}&u2=${user2.trim()}`);
      setComparisonData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to compare users');
    } finally {
      setLoading(false);
    }
  };

  const getWinner = () => {
    if (!comparisonData) return null;
    const score1 = comparisonData.user1.scoring.overall.score;
    const score2 = comparisonData.user2.scoring.overall.score;
    if (score1 > score2) return 'user1';
    if (score2 > score1) return 'user2';
    return 'tie';
  };

  const winner = getWinner();

  return (
    <div className="compare-page">
      <div className="compare-container">
        <h1>Compare GitHub Profiles</h1>
        <p className="compare-description">
          Enter two GitHub usernames to compare their portfolio scores side-by-side
        </p>

        <div className="compare-inputs">
          <div className="input-group">
            <label htmlFor="user1">Username 1</label>
            <input
              id="user1"
              type="text"
              placeholder="Enter username 1"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
            />
          </div>

          <div className="input-group">
            <label htmlFor="user2">Username 2</label>
            <input
              id="user2"
              type="text"
              placeholder="Enter username 2"
              value={user2}
              onChange={(e) => setUser2(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
            />
          </div>

          <button
            className="compare-button"
            onClick={handleCompare}
            disabled={loading}
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {comparisonData && (
          <div className="comparison-results">
            <div className="score-cards-container">
              <div className="score-card-wrapper">
                <h3>{comparisonData.user1.profile.login}</h3>
                <ScoreCard
                  score={comparisonData.user1.scoring.overall.score}
                  scoringData={comparisonData.user1.scoring}
                  isWinner={winner === 'user1'}
                />
              </div>

              <div className="score-card-wrapper">
                <h3>{comparisonData.user2.profile.login}</h3>
                <ScoreCard
                  score={comparisonData.user2.scoring.overall.score}
                  scoringData={comparisonData.user2.scoring}
                  isWinner={winner === 'user2'}
                />
              </div>
            </div>

            <div className="radar-chart-container">
              <h3>Score Comparison</h3>
              <RadarChart
                user1={{
                  name: comparisonData.user1.profile.login,
                  scores: {
                    activity: comparisonData.user1.scoring.portfolio.portfolioScore,
                    codeQuality: comparisonData.user1.scoring.portfolio.averageQuality || 0,
                    diversity: comparisonData.user1.scoring.diversity.diversityScore,
                    community: comparisonData.user1.scoring.profile.profileScore,
                    hiringReadiness: comparisonData.user1.scoring.overall.score,
                  }
                }}
                user2={{
                  name: comparisonData.user2.profile.login,
                  scores: {
                    activity: comparisonData.user2.scoring.portfolio.portfolioScore,
                    codeQuality: comparisonData.user2.scoring.portfolio.averageQuality || 0,
                    diversity: comparisonData.user2.scoring.diversity.diversityScore,
                    community: comparisonData.user2.scoring.profile.profileScore,
                    hiringReadiness: comparisonData.user2.scoring.overall.score,
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;