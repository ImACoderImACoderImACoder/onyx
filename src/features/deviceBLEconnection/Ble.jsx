import styled from "styled-components";
import PrideText from "../../themes/PrideText";
import Patreon from "./Patreon";

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

const StyledPatreon = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  font-size: 18px;
  text-align: center;
  width: 100vw;
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
    "Drag and drop can be used to reorder workflows on all devices",
    "New Setting! You can now have your Volcano automatically turn on the heat when connecting to the app",
    "The new Christmas theme is so cool! Please try it",
    "The Fun theme now has colorful snow",
  ];

  const randomTipIndex = Math.floor(Math.random() * tips.length);
  return (
    <div>
      <Button onClick={props.onClick}>
        <StyledPatreon>
          <Patreon />
        </StyledPatreon>
        <PrideText text="Tap anywhere to connect" />
        <br />
        <br />
        <PrideText text={`Pro Tip: ${tips[randomTipIndex]}`} />
      </Button>
    </div>
  );
}
