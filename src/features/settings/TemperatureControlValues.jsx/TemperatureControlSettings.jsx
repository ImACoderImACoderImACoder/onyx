import styled from "styled-components";
import DeleteIcon from "../../../components/Volcano/icons/DeleteIcon";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
export default function TemperatureControlSettings(props) {
  return (
    <StyledDiv>
      {props.temperature}
      <DeleteIcon onClick={props.onClick} />
    </StyledDiv>
  );
}
