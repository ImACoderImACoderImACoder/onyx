import "./AutoOffCircleStyles.css";
import React from "react";
import { useTheme } from "styled-components";

export default function AutoOffLoadingCircle(props) {
  const { value, minutesLeft, style } = props;
  const theme = useTheme();

  return (
    <div className="loading-circle" style={style}>
      <svg height="100%" viewBox="0 0 36 36" className="circular-chart">
        <path
          className="circle-bg"
          style={{ stroke: theme.iconColor }}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="circle"
          style={{ stroke: theme.backgroundColor }}
          strokeDasharray="100, 100"
          strokeDashoffset={value * -1 || 0}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text
          x="18"
          y="19"
          className="percentage"
          style={{ fill: theme.iconColor }}
        >
          {minutesLeft}
        </text>
      </svg>
    </div>
  );
}
