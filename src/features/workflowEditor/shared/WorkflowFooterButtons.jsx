import styled from "styled-components";
import Button from "../../shared/styledComponents/Button";

const StyledButton = styled(Button)`
  min-height: 50px;
  margin-top: 15px;
  color: ${(props) => props.theme.settingsPageColor};
  flex-grow: 1;
`;

export default StyledButton;
