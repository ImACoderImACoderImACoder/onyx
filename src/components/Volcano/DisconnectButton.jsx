import { useNavigate } from "react-router-dom";
import {
  clearCache,
  getCharacteristic,
} from "../../services/BleCharacteristicCache";
import * as uuIds from "../../constants/uuids";
function DisconnectButton() {
  const navigate = useNavigate();
  const onClick = () => {
    const bleServer = getCharacteristic(uuIds.bleServerUuid);
    bleServer.device.gatt.disconnect();
    clearCache();
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <button onClick={onClick}>Disconnect</button>
    </div>
  );
}
export default DisconnectButton;
