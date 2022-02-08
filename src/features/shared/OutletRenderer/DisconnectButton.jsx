import { useNavigate } from "react-router-dom";
import {
  clearCache,
  getCharacteristic,
} from "../../../services/BleCharacteristicCache";
import * as uuIds from "../../../constants/uuids";
import { StyledIconLink } from "./icons/Shared/IconLink";
import BluetoothDisconnectIcon from "./icons/BluetoothDisconnectIcon";

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
      <StyledIconLink onClick={onClick}>
        <BluetoothDisconnectIcon />
        Disconnect
      </StyledIconLink>
    </div>
  );
}
export default DisconnectButton;
