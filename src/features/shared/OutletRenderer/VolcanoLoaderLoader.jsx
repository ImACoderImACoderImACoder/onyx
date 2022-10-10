import VolcanoLoader from "./VolcanoLoader";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingConection from "../../deviceBLEconnection/LoadingConnection";
import {
  cacheContainsCharacteristic,
  getCharacteristic,
} from "../../../services/BleCharacteristicCache";
import {
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../services/utils";
import { fahrenheitMask } from "../../../constants/masks";
import { register2Uuid, heatOffUuid } from "../../../constants/uuids";
import { useSelector, useDispatch } from "react-redux";
import { setIsF } from "../../settings/settingsSlice";
import { AddToPriorityQueue } from "../../../services/bleQueueing";

function ForCLoader(props) {
  const dispatch = useDispatch();
  const isF = useSelector((state) => state.settings.isF);

  useEffect(() => {
    if (isF !== undefined || !cacheContainsCharacteristic(register2Uuid))
      return;

    const characteristicPrj2V = getCharacteristic(register2Uuid);
    const blePayload = async () => {
      const value = await characteristicPrj2V.readValue();
      const convertedValue = convertBLEtoUint16(value);
      const isFValue = convertToggleCharacteristicToBool(
        convertedValue,
        fahrenheitMask
      );
      dispatch(setIsF(isFValue));
    };
    AddToPriorityQueue(blePayload);
  }, [dispatch, isF]);

  return <>{props.children}</>;
}

export default function VolcanoLoaderLoader() {
  const navigate = useNavigate();
  const isF = useSelector((state) => state.settings.isF);
  useEffect(() => {
    const characteristic = cacheContainsCharacteristic(heatOffUuid);
    if (!characteristic) {
      navigate("/");
    }
  });

  return (
    (isF !== undefined && <VolcanoLoader />) || (
      <ForCLoader>
        <LoadingConection />
      </ForCLoader>
    )
  );
}
