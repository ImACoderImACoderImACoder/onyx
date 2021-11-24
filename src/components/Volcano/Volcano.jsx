import propTypes from "prop-types";
import DisconnectButton from "./DisconnectButton";
import VolcanoSerialNumber from "./features/SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./features/HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./features/VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./features/BleFirmwareVersion/BleFirmwareVersionContainer";
import HeatOn from "./features/HeatOn/HeatOnContainer";
import FanOn from "./features/FanOn/FanOnContainer";
import FOrC from "./features/FOrC/FOrCContainer";

function Volcano(props) {
  return (
    <div>
      <VolcanoSerialNumber bleDevice={props.bleDevice} />
      <HoursOfOperation bleDevice={props.bleDevice} />
      <VolcanoFirmwareVersion bleDevice={props.bleDevice} />
      <FOrC bleDevice={props.bleDevice} />
      <BleFirmwareVersion bleDevice={props.bleDevice} />
      <HeatOn bleDevice={props.bleDevice} />
      <FanOn bleDevice={props.bleDevice} />
      <DisconnectButton
        bleDevice={props.bleDevice}
        setBleDevice={props.setBleDevice}
      />
    </div>
  );
}

Volcano.propTypes = {
  setBleDevice: propTypes.func.isRequired,
  bleDevice: propTypes.object.isRequired,
};

export default Volcano;
