import BleConnectionButton from "./Ble";
import { useNavigate } from "react-router-dom";
import Ble from "../../services/bluetooth";
import Loading from "./LoadingConnection";
import { clearCache } from "../../services/BleCharacteristicCache";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { RE_INITIALIZE_STORE } from "../../constants/actions";
import { clearQueuesAndTimers } from "../../services/bleQueueing";
import React from "react";

export default function BleContainer() {
  const [isBleConnectionBeingEstablished, setIsBleConnectionBeingEstablished] =
    useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onDisconnected = () => {
    clearCache();
    clearQueuesAndTimers();
    navigate("/");
  };

  const onConnected = () => {
    setIsBleConnectionBeingEstablished(true);
  };

  const isOnclickInProgressRef = useRef(false);
  const onClick = async () => {
    if (isOnclickInProgressRef.current) {
      return;
    }

    try {
      isOnclickInProgressRef.current = true;
      await Ble(onConnected, onDisconnected);
      dispatch(RE_INITIALIZE_STORE());
      navigate("/Volcano/App");
    } catch (error) {
      setIsBleConnectionBeingEstablished(false);
      console.log(error);
    } finally {
      isOnclickInProgressRef.current = false;
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
