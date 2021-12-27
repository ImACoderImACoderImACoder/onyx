import BleConnectionButton from "./Ble";
import { useNavigate } from "react-router-dom";
import Ble from "../../services/bluetooth";
import LastAppServerRefresh from "../LastAppRefresh/LastAppServerRefresh";
import Loading from "./LoadingConnection";
import { clearCache } from "../../services/BleCharacteristicCache";
import { useState } from "react";
export default function BleContainer(props) {
  const [isBleConnectionBeingEstablished, setIsBleConnectionBeingEstablished] =
    useState(false);

  const navigate = useNavigate();
  const onDisconnected = () => {
    clearCache();
    navigate("/");
  };

  const onConnected = () => {
    setIsBleConnectionBeingEstablished(true);
  };
  const onClick = async () => {
    try {
      const result = await Ble(onConnected, onDisconnected);
      console.log(result);
      navigate("/Volcano/App");
    } catch (error) {
      setIsBleConnectionBeingEstablished(false);
      console.log(error);
    }
  };
  return (
    <div>
      <LastAppServerRefresh renderTimestamp={props.renderTimestamp} />
      {isBleConnectionBeingEstablished ? (
        <Loading />
      ) : (
        <BleConnectionButton onClick={onClick} />
      )}
    </div>
  );
}
