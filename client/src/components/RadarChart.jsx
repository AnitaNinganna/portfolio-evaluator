import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ user1 = {}, user2 = {}, scores }) => {
  const labels = ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Readiness'];

  const buildSingleData = () => {
    return [
      scores?.activity ?? 0,
      scores?.codeQuality ?? 0,
      scores?.diversity ?? 0,
      scores?.community ?? 0,
      scores?.hiringReadiness ?? 0,
    ];
  };

  const buildUserData = (user) => {
    return [
      user?.scores?.activity ?? 0,
      user?.scores?.codeQuality ?? 0,
      user?.scores?.diversity ?? 0,
      user?.scores?.community ?? 0,
      user?.scores?.hiringReadiness ?? 0,
    ];
  };

  const isComparison = !!user1.name && !!user2.name && !scores;

  const data = {
    labels,
    datasets: isComparison
      ? [
          {
            label: user1.name || 'User 1',
            data: buildUserData(user1),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
          },
          {
            label: user2.name || 'User 2',
            data: buildUserData(user2),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
          },
        ]
      : [
          {
            label: user1.name || 'Profile Score',
            data: buildSingleData(),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
          },
        ],
  };

  const chartTitle = isComparison
    ? `${user1.name || 'User 1'} vs ${user2.name || 'User 2'} - Portfolio Comparison`
    : `${user1.name || 'Your profile'} - Portfolio Overview`;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.r}`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;