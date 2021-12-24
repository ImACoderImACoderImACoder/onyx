import { useNavigate } from "react-router-dom";
import {
  clearCache,
  getCharacteristic,
} from "../../services/BleCharacteristicCache";
import * as uuIds from "../../constants/uuids";
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
      <button className="f-or-c-button" onClick={onClick}>
        Disconnect
      </button>
    </div>
  );
}
export default DisconnectButton;
