import { useNavigate } from "react-router-dom";

function DisconnectButton(props) {
  const navigate = useNavigate();
  const onClick = () => {
    props.bleDevice.gatt.disconnect();
    props.setBleDevice(undefined);
    navigate("/");
    window.location.reload();
  };

  return <button onClick={onClick}>Disconnect</button>;
}
export default DisconnectButton;
