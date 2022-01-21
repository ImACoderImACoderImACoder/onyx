import styled from "styled-components";
import Patreon from "./Patreon";

const Button = styled.button`
  min-height: 30px;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.backgroundColor};
  font-size: 30px;
  color: ${(props) => props.theme.homePageColor};
  border-width: 0px;
  border-style: ${(props) => props.theme.borderStyle}
  border-color: ${(props) => props.theme.borderColor}
`;

export default function Ble(props) {
  return (
    <div>
      <Patreon />
      <Button onClick={props.onClick}>Tap anywhere to connect</Button>
    </div>
  );
}
