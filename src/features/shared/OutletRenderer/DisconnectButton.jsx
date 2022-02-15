import { useNavigate } from "react-router-dom";
import {
  clearCache,
  getCharacteristic,
} from "../../../services/BleCharacteristicCache";
import * as uuIds from "../../../constants/uuids";
import BluetoothDisconnectIcon from "./icons/BluetoothDisconnectIcon";
import { StyledRouterIconLink } from "./icons/Shared/IconLink";
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
      <StyledRouterIconLink to="/" onClick={onClick}>
        <BluetoothDisconnectIcon />
        Disconnect
      </StyledRouterIconLink>
    </div>
  );
}
export default DisconnectButton;
