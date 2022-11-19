import { heatOnUuid, heatOffUuid } from "../../../constants/uuids";
import HeatOn from "./HeatOn";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../hooks/ts/wrappers";
import { setIsHeatOn } from "../deviceInteractionSlice";
import { AddToPriorityQueue } from "../../../services/bleQueueing";
import { convertToUInt8BLE } from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";

export default function HeatOnContainer() {
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);
  const dispatch = useDispatch();

  const onClick = (nextState: boolean) => {
    const blePayload = async () => {
      const targetCharacteristicUuid = nextState ? heatOnUuid : heatOffUuid;
      const characteristic = getCharacteristic(targetCharacteristicUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
      dispatch(setIsHeatOn(nextState));
    };
    AddToPriorityQueue(blePayload);
  };

  return <HeatOn onChange={onClick} isHeatOn={isHeatOn || false} />;
}
