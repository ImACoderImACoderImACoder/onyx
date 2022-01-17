import styled from "styled-components";

const Button = styled.button`
  min-height: 30px;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.backgroundColor};
  font-size: 30px;
  color: ${(props) => props.theme.primaryFontColor};
  border-width: 0px;
`;

export default function Ble(props) {
  return (
    <div>
      <Button onClick={props.onClick}>Tap anywhere to connect</Button>
    </div>
  );
}
