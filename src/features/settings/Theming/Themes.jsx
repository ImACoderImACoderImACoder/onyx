import Select from "react-bootstrap/FormSelect";
import styled, { useTheme } from "styled-components";
import PrideText from "../../../themes/PrideText";
import Div from "../Shared/StyledComponents/Div";

const StyledSelect = styled(Select)`
  max-width: 250px;
  color: ${(props) => props.theme.primaryFontColor};
  background-color: ${(props) => props.theme.backgroundColor};
  border-color: ${(props) => props.theme.borderColor};
`;

export default function Themes(props) {
  const theme = useTheme();
  return (
    <Div>
      <h2>
        <PrideText text="Select a Theme" />
      </h2>
      <StyledSelect value={props.currentTheme} onChange={props.onChange}>
        {props.options}
      </StyledSelect>
      <span>
        <i>Theme by: {theme.author}</i>
      </span>
    </Div>
  );
}
