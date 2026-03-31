import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

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
    return <div className="report-container"><p>Loading report...</p></div>;
  }

  if (error) {
    return (
      <div className="report-container">
        <p className="error-message">Error: {error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="report-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Home
      </button>
      <div className="report-content">
        <h1>Report for {username}</h1>
        {report ? (
          <div className="report-details">
            <pre>{JSON.stringify(report, null, 2)}</pre>
          </div>
        ) : (
          <p>No report data available.</p>
        )}
      </div>
    </div>
  );
};

export default Report;
