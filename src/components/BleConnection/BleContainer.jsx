import BleConnectionButton from "./Ble";
import { useNavigate } from "react-router-dom";
import Ble from "../../services/bluetooth";

export default function BleContainer(props) {
  const navigate = useNavigate();
  const onClick = () => {
    Promise.resolve()
      .then(() => Ble)
      .then((response) => {
        console.log(response);
        navigate("/Volcano");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return <BleConnectionButton onClick={onClick} />;
}
