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
  return (
    <div>
      <Button onClick={props.onClick}>
        <StyledPatreon>
          <Patreon />
        </StyledPatreon>
       <PrideText text="Tap anywhere to connect" />
       <br/>
       <PrideText text="New theme released! (Pride)" />
      </Button>
    </div>
  );
}
