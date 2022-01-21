import styled from "styled-components";

export const InactiveButton = styled.button`
  font-size: x-large;
  min-height: 35px;
  flex-grow: 1;
  background-color: ${(props) => props.theme.buttonColorMain};
  color: ${(props) => props.theme.primaryFontColor};
  border-radius: 15px;
  border-color: ${(props) => props.theme.borderColor};
  border-style: ${(props) => props.theme.borderStyle};
  &:active {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
    border-color: ${(props) => props.theme.buttonActive.borderColor};
  }
`;

export const ActiveButton = styled(InactiveButton)`
  background-color: ${(props) => props.theme.buttonActive.backgroundColor};
  color: ${(props) => props.theme.buttonActive.color};
  border-color: ${(props) => props.theme.buttonActive.borderColor};
`;

export const PlusMinusButton = styled(InactiveButton)`
  background-color: ${(props) => props.theme.plusMinusButtons.backgroundColor};
  color: ${(props) => props.theme.plusMinusButtons.color};
  border-color: ${(props) => props.theme.plusMinusButtons.borderColor};
`;

export const Div = styled.div`
  display: flex;
  max-width: 50%;
  flex: 50%;
  margin-bottom: 5px;
`;
