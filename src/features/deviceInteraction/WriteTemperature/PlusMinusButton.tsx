import { Div } from "./styledComponents";
import { PlusMinusButton as StyledPlusMinusButton } from "./styledComponents";

interface PlusMinusButtonProps {
  buttonText: string;
}

export default function PlusMinusButton(props: PlusMinusButtonProps) {
  return (
    <Div>
      <StyledPlusMinusButton {...props}>
        {props.buttonText}
      </StyledPlusMinusButton>
    </Div>
  );
}
