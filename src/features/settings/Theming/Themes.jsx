import Select from "react-bootstrap/FormSelect";
import styled, { useTheme } from "styled-components";
import Div from "../Shared/StyledComponents/Div";

const StyledSelect = styled(Select)`
  max-width: 250px;
  color: ${(props) => props.theme.settingsPageColor};
  background-color: ${(props) => props.theme.backgroundColor};
  border-color: ${(props) => props.theme.borderColor};
`;

export default function Themes(props) {
  const theme = useTheme();
  return (
    <Div>
      <h1>Select a Theme</h1>
      <StyledSelect value={props.currentTheme} onChange={props.onChange}>
        {props.options}
      </StyledSelect>
      <span>Theme by: {theme.author}</span>
    </Div>
  );
}
