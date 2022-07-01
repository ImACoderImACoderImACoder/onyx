import styled from "styled-components";
import PrideText from "../../themes/PrideText";
import Patreon from "./Patreon";

const Button = styled.button`
  min-height: 30px;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.backgroundColor};
  font-size: 30px;
  color: ${(props) => props.theme.primaryFontColor};
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
  
  const tips = ['You can send the app developer a message from the info screen',
                'Spacebar toggles the fan',
                'Setting the screen to 0 brightness turns it off',
                'Don\'t forget to clean your herb chamber :D',
                'Remember to check on your Volcano\'s air filter',
                'You can change the look of the app by changing themes in the settings page',
                'Use workflows to take full control of your Volcano',
                'You can add or remove temperatures in the settings page']
  
  const randomTipIndex = Math.floor(Math.random() * tips.length);
  return (
    <div>
      <Button onClick={props.onClick}>
        <StyledPatreon>
          <Patreon />
        </StyledPatreon>
       <PrideText text="Tap anywhere to connect" />
       <br/>
       <br/>
       <PrideText text={`Pro Tip: ${tips[randomTipIndex]}`} />
      </Button>
    </div>
  );
}
