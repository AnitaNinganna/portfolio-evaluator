import React from 'react';
import SearchBar from '../components/SearchBar';
import '../components/Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Developer Portfolio Evaluator 🚀</h1>
        <p>Evaluate and analyze developer portfolios with AI-powered insights</p>
      </header>
      <main className="home-main">
        <SearchBar />
        <div className="features">
          <div className="feature">
            <h3>🔍 GitHub Analysis</h3>
            <p>Analyze GitHub repositories and contribution patterns</p>
          </div>
          <div className="feature">
            <h3>📊 Scoring System</h3>
            <p>Get detailed scores and recommendations</p>
          </div>
          <div className="feature">
            <h3>📈 Portfolio Insights</h3>
            <p>Comprehensive portfolio evaluation reports</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
