import BleConnectionButton from "./Ble";
import { useNavigate } from "react-router-dom";
import Ble from "../../services/bluetooth";
import LastAppServerRefresh from "../LastAppRefresh/LastAppServerRefresh";
import Loading from "./LoadingConnection";
import { useState } from "react";
export default function BleContainer(props) {
  const [isBleConnectionBeingEstablished, setIsBleConnectionBeingEstablished] =
    useState(false);

  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const result = await Ble(() => setIsBleConnectionBeingEstablished(true));
      console.log(result);
      navigate("/Volcano");
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
