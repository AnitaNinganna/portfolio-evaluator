import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import '../components/Home.css';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSearch = () => {
    document.getElementById('search-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home">
      <header className={`home-header ${isVisible ? 'visible' : ''}`}>
        <h1>Developer Portfolio Evaluator 🚀</h1>
        <p>Evaluate and analyze developer portfolios with AI-powered insights and make every GitHub profile shine.</p>
        <div className="hero-actions">
          <button className="hero-button" onClick={scrollToSearch}>
            Start Your Free Scan
          </button>
          <button className="hero-button secondary" onClick={() => window.location.href = '/about'}>
            Learn More
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Portfolios Analyzed</span>
          </div>
          <div className="stat">
            <span className="stat-number">95%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
      </header>

      <main className={`home-main ${isVisible ? 'visible' : ''}`}>
        <div id="search-anchor">
          <SearchBar />
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">🔍</div>
            <h3>GitHub Analysis</h3>
            <p>Deep analysis of repositories, contribution patterns, and coding activity</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <h3>AI Scoring System</h3>
            <p>Get detailed scores across multiple dimensions with actionable insights</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📈</div>
            <h3>Portfolio Insights</h3>
            <p>Comprehensive evaluation reports with personalized recommendations</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h3>Career Guidance</h3>
            <p>Identify strengths, weaknesses, and next steps for career advancement</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Updates</h3>
            <p>Live data from GitHub with instant portfolio evaluation</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Privacy First</h3>
            <p>Your data stays secure and private throughout the analysis</p>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to evaluate your portfolio?</h2>
          <p>Join thousands of developers who have improved their GitHub presence</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
