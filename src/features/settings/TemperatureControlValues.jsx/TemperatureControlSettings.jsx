import DeleteIcon from "../../../components/Volcano/icons/DeleteIcon";

export default function TemperatureControlSettings(props) {
  return (
    <div>
      <div>
        {props.temperature}
        <DeleteIcon onClick={props.onClick} />
      </div>
    </div>
  );
}
