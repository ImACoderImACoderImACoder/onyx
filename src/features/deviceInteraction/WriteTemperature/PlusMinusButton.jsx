import { Div } from "./styledComponents";
import { PlusMinusButton as StyledPlusMinusButton } from "./styledComponents";

function PlusMinusButton(props) {
  return (
    <Div>
      <StyledPlusMinusButton onClick={props.onClick}>
        {props.buttonText}
      </StyledPlusMinusButton>
    </Div>
  );
}

export default PlusMinusButton;
