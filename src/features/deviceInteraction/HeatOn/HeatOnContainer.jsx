import { heatOnUuid, heatOffUuid } from "../../../constants/uuids";
import HeatOn from "./HeatOn";
import { useDispatch } from "react-redux";
import { setIsHeatOn } from "../deviceInteractionSlice";
import { AddToQueue } from "../../../services/bleQueueing";
import { convertToUInt8BLE } from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import useIsHeatOn from "./useIsHeatOn";

export default function HeatOnContainer() {
  const isHeatOn = useIsHeatOn();
  const dispatch = useDispatch();

  const onClick = (nextState) => {
    const blePayload = async () => {
      const targetCharacteristicUuid = nextState ? heatOnUuid : heatOffUuid;
      const characteristic = getCharacteristic(targetCharacteristicUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);

    //used to prevent a warning I don't fully understand.
    setTimeout(() => dispatch(setIsHeatOn(nextState)), 100);
  };

  return <HeatOn onChange={onClick} isHeatOn={isHeatOn} />;
}
