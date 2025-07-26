import React from "react";
import { useSelector } from "react-redux";
import {
  aSuperSpecialAutoThemeSettingsId,
  funId,
  prideClassicId,
  prideVibrantId,
} from "../constants/themeIds";
import GetTheme from "./ThemeProvider";

export default function PrideText(props) {
  const theme = useSelector((state) => {
    const currentTheme =
      state.settings.config?.currentTheme || GetTheme().themeId;
    if (currentTheme === aSuperSpecialAutoThemeSettingsId) {
      return GetTheme(currentTheme).themeId;
    }
    return currentTheme;
  });

  if (theme === prideClassicId) {
    const colors = [
      "#D12229",
      "#F68A1E", 
      "#FDE01A",
      "#007940",
      "#004efd",
      "#732982",
    ];
    let colorIndex = 0;

    return (
      <div style={{ 
        whiteSpace: 'normal', 
        wordWrap: 'break-word', 
        overflowWrap: 'break-word',
        display: 'inline'
      }}>
        {props.text.split("").map((char, index) => {
          if (char === " ") {
            return " ";
          }
          
          const currentColor = colors[colorIndex % colors.length];
          colorIndex++;
          
          return (
            <span key={index} style={{ color: currentColor }}>
              {char}
            </span>
          );
        })}
      </div>
    );
  }

  if (theme === funId) {
    const colors = [
      "#FF0000",
      "#FFA500", 
      "#FFFF00",
      "#00FF00",
      "#004efd",
      "#7f00ff",
    ];
    let colorIndex = Math.floor(Math.random() * 6);

    const textShadowOptions = ["AAFA0F", "FFC0CB", "50e3ff"];
    const textShadowColor =
      textShadowOptions[Math.floor(Math.random() * textShadowOptions.length)];
    const textShadowOffset = "0.5";

    return (
      <div style={{ 
        whiteSpace: 'normal', 
        wordWrap: 'break-word', 
        overflowWrap: 'break-word',
        display: 'inline'
      }}>
        {props.text.split("").map((char, index) => {
          if (char === " ") {
            return " ";
          }
          
          const currentColor = colors[colorIndex % colors.length];
          colorIndex++;
          
          return (
            <span
              key={index}
              style={{
                color: currentColor,
                textShadow: `-${textShadowOffset}px ${textShadowOffset}px 1px #${textShadowColor}, ${textShadowOffset}px ${textShadowOffset}px 1px #${textShadowColor}, ${textShadowOffset}px -${textShadowOffset}px 1px #${textShadowColor}, -${textShadowOffset}px -${textShadowOffset}px 1px #${textShadowColor}`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  }

  if (theme === prideVibrantId) {
    const colors = [
      "#FF0000",
      "#FFA500",
      "#FFFF00", 
      "#00FF00",
      "#004efd",
      "#7f00ff",
    ];
    let colorIndex = Math.floor(Math.random() * 6);

    return (
      <div style={{ 
        whiteSpace: 'normal', 
        wordWrap: 'break-word', 
        overflowWrap: 'break-word',
        display: 'inline'
      }}>
        {props.text.split("").map((char, index) => {
          if (char === " ") {
            return " ";
          }
          
          const currentColor = colors[colorIndex % colors.length];
          colorIndex++;
          
          return (
            <span 
              key={index}
              style={{ 
                color: currentColor, 
                textShadow: "0.5px 0.5px #ed75b3" 
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  }
  return props.text;
}

export function PrideTextWithDiv(props) {
  return <div>{<PrideText {...props} />}</div>;
}
