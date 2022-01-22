import BleConnectionButton from "./Ble";
import { useNavigate } from "react-router-dom";
import Ble from "../../services/bluetooth";
import Loading from "./LoadingConnection";
import { clearCache } from "../../services/BleCharacteristicCache";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { RE_INITIALIZE_STORE } from "../../constants/actions";

export default function BleContainer(props) {
  const [isBleConnectionBeingEstablished, setIsBleConnectionBeingEstablished] =
    useState(false);

  const dispatch = useDispatch();
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
      dispatch(RE_INITIALIZE_STORE());
      navigate("/Volcano/App");
    } catch (error) {
      setIsBleConnectionBeingEstablished(false);
      console.log(error);
    }
  };

  return (
    <div>
      {isBleConnectionBeingEstablished ? (
        <Loading />
      ) : (
        <BleConnectionButton onClick={onClick} />
      )}
    </div>
  );
}
