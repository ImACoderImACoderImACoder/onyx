import styled from "styled-components";

const Button = styled.button`
  background-color: ${(props) => props.theme.buttonColorMain};
  color: ${(props) => props.theme.buttonFontColor};
  border-radius: 5px;
  border-color: ${(props) => props.theme.borderColor};
  border-style: ${(props) => props.theme.borderStyle};
  &:active {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
  }
`;

export default Button;
