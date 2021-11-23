import BleConnectionButton from "./Ble";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BleContainer(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isBluetoothConnected) {
      navigate("/Volcano");
    }
  });

  return (
    <BleConnectionButton
      onClick={props.onClick}
      isConnected={props.isBluetoothConnected}
    />
  );
}
