import styled from "styled-components";
import Patreon from "./Patreon";
import LastAppServerRefresh from "../../features/lastAppRefresh/LastAppRefresh/LastAppServerRefresh";

const Button = styled.button`
  min-height: 30px;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.backgroundColor};
  font-size: 30px;
  color: ${(props) => props.theme.homePageColor};
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

const StyledLastSynced = styled(StyledPatreon)`
  bottom: 0;
  right: 0;
  top: auto;
  text-align: center;
`;

export default function Ble(props) {
  return (
    <div>
      <Button onClick={props.onClick}>
        <StyledPatreon>
          <Patreon />
        </StyledPatreon>
        <StyledLastSynced>
          <LastAppServerRefresh />
        </StyledLastSynced>
        Tap anywhere to connect.
      </Button>
    </div>
  );
}
