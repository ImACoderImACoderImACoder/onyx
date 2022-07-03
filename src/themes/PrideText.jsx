import { useSelector } from "react-redux";
import { prideId } from "../constants/themeIds";
import GetTheme from "./ThemeProvider";

export default function PrideText(props) {
  const theme = useSelector(
    (state) => state.settings.config?.currentTheme || GetTheme()
  );

  if (theme !== prideId) {
    return props.text;
  }

  let spans = [];

  let currentColorIndex = Math.floor(Math.random() * 6);

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
    //#FFC0CB pink
    // #50e3ff blue
    spans.push(
      <span
        key={i}
        style={{ color: currentSpanColor, textShadow: "0.5px 0.5px #50e3ff" }}
      >
        {props.text[i]}
      </span>
    );
  }
  return <>{spans}</>;
}
