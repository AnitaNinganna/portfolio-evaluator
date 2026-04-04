import React from "react";
import "./HeatMap.css";

const getColor = (count) => {
  if (count === 0) return "#2d2d2d";
  if (count < 3) return "#0e4429";
  if (count < 6) return "#006d32";
  if (count < 10) return "#26a641";
  return "#39d353";
};

const buildHeatmap = (data = []) => {
  if (!data.length) {
    return { weeks: [], monthLabels: [] };
  }

  const weeks = [];
  const startDate = new Date(data[0].date);
  const startDay = startDate.getDay();
  let currentWeek = [];

  for (let i = 0; i < startDay; i += 1) {
    currentWeek.push(null);
  }

  data.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const monthLabels = [];
  let lastMonth = "";

  weeks.forEach((week, index) => {
    const firstDay = week.find(Boolean);
    if (!firstDay) return;

    const month = new Date(firstDay.date).toLocaleString("default", {
      month: "short",
    });

    if (month !== lastMonth) {
      monthLabels.push({ month, weekIndex: index });
      lastMonth = month;
    }
  });

  return { weeks, monthLabels };
};

const HeatMap = ({ data = [] }) => {
  const { weeks, monthLabels } = buildHeatmap(data);

  if (!data.length) {
    return (
      <div className="heatmap-wrapper">
        <div className="heatmap-header">
          <div>
            <h2>Contribution Heatmap</h2>
            <p>No contributions available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-header">
        <div>
          <h2>Contribution Heatmap</h2>
          <p>{data.length} days across {weeks.length} weeks</p>
        </div>
      </div>

      <div
        className="heatmap-month-labels"
        style={{ gridTemplateColumns: `repeat(${weeks.length}, 18px)` }}
      >
        {monthLabels.map((label) => (
          <span
            key={`${label.month}-${label.weekIndex}`}
            className="heatmap-month-label"
            style={{ gridColumnStart: label.weekIndex + 1 }}
          >
            {label.month}
          </span>
        ))}
      </div>

      <div
        className="heatmap-grid"
        style={{ gridTemplateColumns: `repeat(${weeks.length}, 18px)` }}
      >
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const title = day
              ? `${day.date} – ${day.count} commit${day.count === 1 ? "" : "s"}`
              : "No data";

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="heatmap-cell"
                style={{ backgroundColor: getColor(day?.count || 0) }}
                title={title}
              />
            );
          })
        )}
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <div className="legend-block no-activity" />
        <div className="legend-block low-activity" />
        <div className="legend-block medium-activity" />
        <div className="legend-block high-activity" />
        <div className="legend-block max-activity" />
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMap;
