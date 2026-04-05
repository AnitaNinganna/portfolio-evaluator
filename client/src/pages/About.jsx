import React from 'react';
import '../components/Home.css';

const About = () => {
  return (
    <div className="home" style={{ minHeight: '80vh', paddingBottom: '3rem' }}>
      <div className="home-header visible" style={{ marginBottom: '2rem' }}>
        <h1>About Portfolio Evaluator</h1>
        <p>This app gives GitHub portfolio insights based on repository performance, language distribution, and all-around scoring.</p>
      </div>

      <section className="about-grid" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="feature">
          <div className="feature-icon">🌟</div>
          <h3>Mission</h3>
          <p>Empower developers to understand their GitHub brand and get actionable improvement suggestions.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">⚙️</div>
          <h3>How it works</h3>
          <p>Fetches GitHub data using Octokit, calculates scores, sorts top repos, and builds interactive visual reports.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔍</div>
          <h3>Features</h3>
          <p>Includes shareable report links, repo analytics, language charts, heatmaps, and caching for faster repeated views.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🚀</div>
          <h3>What’s next</h3>
          <p>Planned improvements include commit timeline insights, AI recommendations, and profile benchmarking.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
