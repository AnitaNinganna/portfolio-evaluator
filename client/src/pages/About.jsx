import React from 'react';
import '../components/Home.css';

const About = () => {
  return (
    <div className="home" style={{ minHeight: '80vh' }}>
      <div className="home-header">
        <h1>About Portfolio Evaluator</h1>
        <p>This app gives GitHub portfolio insights based on top repository performance, language distribution, and all-around scoring.</p>
      </div>

      <div className="features" style={{ maxWidth: '850px', margin: '0 auto', color: '#fff' }}>
        <div className="feature">
          <h3>🌟 Mission</h3>
          <p>Empower developers to understand their GitHub brand and get actionable improvement suggestions.</p>
        </div>
        <div className="feature">
          <h3>⚙️ How it works</h3>
          <p>Fetches GitHub data using Octokit, calculates scores, sorts top repos, and creates interactive charts.</p>
        </div>
        <div className="feature">
          <h3>🚀 What’s next</h3>
          <p>Heatmap contributions, commit history insights, and AI-based recommendation engine.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
