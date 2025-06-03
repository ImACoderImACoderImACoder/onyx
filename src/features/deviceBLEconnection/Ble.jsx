import styled from "styled-components";
import PrideText from "../../themes/PrideText";

const Button = styled.button`
  min-height: 30px;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.backgroundColor};
  font-size: 30px;
  color: ${(props) => props.theme.iconColor};
  border-width: 0px;
  border-style: ${(props) => props.theme.borderStyle};
  border-color: ${(props) => props.theme.borderColor};
`;

export default function Ble(props) {
  const tips = [
    "Spacebar toggles the fan",
    "Setting the screen to 0 brightness turns it off",
    "Don't forget to clean your herb chamber :D",
    "Remember to check your Volcano's air filter",
    "You can change the look of the app by changing themes in the settings page",
    "Use workflows to take full control of your Volcano",
    "You can add or remove temperatures in the settings page",
    "Frequent users should replace bags every 2-4 weeks for optimal flavor",
    "10 minutes or less is the ideal time for a bag to store vapor",
    "For best results preheat the chamber for 2-5 seconds before attaching the bag",
    "Drag and drop can be used to reorder workflows and workflow items on all devices",
    "If you want to visually see the last workflow run you can enable highlight last run workflow in settings",
    "The Auto Seasonal Rotate theme selects a festive theme when it can and falls back on a semi-random theme",
  ];

  const randomTipIndex = Math.floor(Math.random() * tips.length);
  return (
    <div>
      <Button onClick={props.onClick}>
        <PrideText text="Tap anywhere to connect." />
        <br />
        <br />
        <PrideText text={`Pro Tip: ${tips[randomTipIndex]}`} />
        <br />
        <br />
      </Button>
    </div>
  );
}
