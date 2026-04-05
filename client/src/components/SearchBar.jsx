import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Please enter a GitHub username';
    }

    if (username.length > 39) {
      return 'GitHub usernames cannot be longer than 39 characters';
    }

    // GitHub username regex: alphanumeric, hyphens, underscores, no consecutive hyphens
    const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!usernameRegex.test(username)) {
      return 'Invalid GitHub username format';
    }

    return null;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const validationError = validateUsername(searchTerm);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Navigate immediately - the Report component will handle loading and errors
      navigate(`/report/${searchTerm.trim()}`);
      setSearchTerm('');
    } catch (err) {
      setError('Failed to navigate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="input-container">
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="Search any GitHub username..."
            value={searchTerm}
            onChange={handleInputChange}
            className={`search-input ${error ? 'error' : ''}`}
            disabled={isLoading}
            maxLength={39}
            aria-label="GitHub username"
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        <button
          type="submit"
          className={`search-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || !searchTerm.trim()}
        >
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;