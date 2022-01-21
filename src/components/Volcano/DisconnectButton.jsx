import { useNavigate } from "react-router-dom";
import {
  clearCache,
  getCharacteristic,
} from "../../services/BleCharacteristicCache";
import * as uuIds from "../../constants/uuids";
import Button from "../../features/shared/styledComponents/Button";
import styled from "styled-components";
const StyledDisconnectButton = styled(Button)`
  color: ${(props) => props.theme.disconnectButtonFont};
`;
function DisconnectButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    const bleDevice = getCharacteristic(uuIds.bleDeviceUuid);
    await bleDevice.gatt.disconnect();
    clearCache();
    navigate("/");
  };

  return (
    <div>
      <StyledDisconnectButton onClick={onClick}>
        Disconnect
      </StyledDisconnectButton>
    </div>
  );
}
export default DisconnectButton;
