import { useSelector } from "react-redux";
import { funId, prideId } from "../constants/themeIds";
import GetTheme from "./ThemeProvider";

export default function PrideText(props) {
  const theme = useSelector(
    (state) => state.settings.config?.currentTheme || GetTheme()
  );

  if (theme === prideId) {
    let spans = [];

    let currentColorIndex = 0;

    for (let i = 0; i < props.text.length; i++) {
      let currentSpanColor;
      switch (currentColorIndex % 6) {
        case 0:
          currentSpanColor = "#D12229";
          break;
        case 1:
          currentSpanColor = "#F68A1E";
          break;
        case 2:
          currentSpanColor = "#FDE01A";
          break;
        case 3:
          currentSpanColor = "#007940";
          break;
        case 4:
          currentSpanColor = "#004efd";
          break;
        case 5:
          currentSpanColor = "#732982";
          break;
        default:
          currentSpanColor = "#FFFFFF";
      }

      if (props.text[i] !== " ") {
        currentColorIndex++;
      }

      spans.push(
        <span
          key={i}
          style={{
            color: currentSpanColor,
          }}
        >
          {props.text[i]}
        </span>
      );
    }
    return <>{spans}</>;
  }

  if (theme === funId) {
    let spans = [];

    let currentColorIndex = Math.floor(Math.random() * 6);

    const textShadowOptions = ["AAFA0F", "FFC0CB", "50e3ff"];

    const currentShadowColorIndex = Math.floor(
      Math.random() * textShadowOptions.length
    );

    const textShadowColor = textShadowOptions[currentShadowColorIndex];

    for (let i = 0; i < props.text.length; i++) {
      let currentSpanColor;
      switch (currentColorIndex % 6) {
        case 0:
          currentSpanColor = "#FF0000";
          break;
        case 1:
          currentSpanColor = "#FFA500";
          break;
        case 2:
          currentSpanColor = "#FFFF00";
          break;
        case 3:
          currentSpanColor = "#00FF00";
          break;
        case 4:
          currentSpanColor = "#004efd";
          break;
        case 5:
          currentSpanColor = "#7f00ff";
          break;
        default:
          currentSpanColor = "#FFFFFF";
      }

      if (props.text[i] !== " ") {
        currentColorIndex++;
      }

      const textShadowOffset = "0.5";

      spans.push(
        <span
          key={i}
          style={{
            color: currentSpanColor,
            textShadow: `-${textShadowOffset}px ${textShadowOffset}px 1px #${textShadowColor}, ${textShadowOffset}px ${textShadowOffset}px 1px #${textShadowColor}, ${textShadowOffset}px -${textShadowOffset}px 1px #${textShadowColor}, -0${textShadowOffset}px -${textShadowOffset}px  1px #${textShadowColor}`,
          }}
        >
          {props.text[i]}
        </span>
      );
    }
    return <>{spans}</>;
  }

  return props.text;
}
