import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LanguageBarChart = ({ languages }) => {
  const [sortedLanguages, setSortedLanguages] = useState(languages);
  const [sortBy, setSortBy] = useState('value'); // 'value' or 'name'

  useEffect(() => {
    const sorted = [...languages].sort((a, b) => {
      if (sortBy === 'value') {
        return b.value - a.value;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    setSortedLanguages(sorted);
  }, [languages, sortBy]);

  const data = {
    labels: sortedLanguages.map(lang => lang.name),
    datasets: [
      {
        label: 'Usage (%)',
        data: sortedLanguages.map(lang => lang.value),
        backgroundColor: sortedLanguages.map((_, index) => `hsl(${(index * 360) / sortedLanguages.length}, 70%, 50%)`),
        borderColor: sortedLanguages.map((_, index) => `hsl(${(index * 360) / sortedLanguages.length}, 70%, 40%)`),
        borderWidth: 1,
        hoverBackgroundColor: sortedLanguages.map((_, index) => `hsl(${(index * 360) / sortedLanguages.length}, 80%, 60%)`),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Language Distribution',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Languages',
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const language = sortedLanguages[index];
        alert(`Language: ${language.name}\nUsage: ${language.value}%`);
      }
    },
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setSortBy('value')} style={{ marginRight: '10px' }}>Sort by Usage</button>
        <button onClick={() => setSortBy('name')}>Sort by Name</button>
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default LanguageBarChart;