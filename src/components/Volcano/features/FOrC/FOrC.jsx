import Button from "../../../../features/shared/styledComponents/Button";
import Div from "../../../../features/settings/Shared/StyledComponents/Div";
import styled from "styled-components";

const FOrCStyledButton = styled(Button)`
  color: ${(props) => props.theme.settingsPageColor};
`;
export default function FOrC(props) {
  return (
    <Div>
      <FOrCStyledButton onClick={props.onClick}>
        Change To: {props.temperatureScaleAbbreviation}
      </FOrCStyledButton>
    </Div>
  );
}
