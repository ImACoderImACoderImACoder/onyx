import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";

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
DisconnectButton.propTypes = {
  bleDevice: propTypes.object.isRequired,
  setBleDevice: propTypes.func.isRequired,
};

export default DisconnectButton;
