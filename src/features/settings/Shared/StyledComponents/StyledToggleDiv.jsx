import styled from "styled-components";
import ToggleSwitch from "../../../shared/styledComponents/Switch";

const StyledToggleDiv = styled.div`
  max-height: 40px;
  min-width: 80px;
  display: flex;
`;

export default function StyledToggle(props) {
  return (
    <StyledToggleDiv>
      <ToggleSwitch {...props} />
    </StyledToggleDiv>
  );
}
