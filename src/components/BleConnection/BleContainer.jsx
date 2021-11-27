import BleConnectionButton from "./Ble";
import { useNavigate } from "react-router-dom";
import Ble from "../../services/bluetooth";
import LastAppServerRefresh from "../LastAppRefresh/LastAppServerRefresh";

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
  return (
    <div>
      <LastAppServerRefresh renderTimestamp={props.renderTimestamp} />
      <BleConnectionButton onClick={onClick} />;
    </div>
  );
}
