import styled from "styled-components";
import ToggleSwitch from "../../../shared/styledComponents/Switch";

const StyledToggleDiv = styled.div`
  min-height: 40px;
  max-width: 80px;
  display: flex;
`;

export default function StyledToggle(props) {
  return (
    <StyledToggleDiv>
      <ToggleSwitch {...props} />
    </StyledToggleDiv>
  );
}
