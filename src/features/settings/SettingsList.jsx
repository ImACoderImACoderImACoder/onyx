import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import VibrationToggleContainer from "./VibrationToggle/VibrationToggleContainer";

function SettingsList() {
  return (
    <Card style={{ width: "fit-content" }}>
      <Card.Header>Featured</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <VibrationToggleContainer />
        </ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default SettingsList;
