import styled from "styled-components";

export const InactiveButton = styled.button`
  font-size: 1.25rem;
  min-height: 2.75rem;
  flex-grow: 1;
  border-width: 0.15rem;
  background-color: ${(props) => props.theme.buttonColorMain};
  color: ${(props) => props.theme.primaryFontColor};
  border-radius: 2rem;
  border-color: ${(props) => props.theme.borderColor};
  white-space: nowrap;
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

  svg {
    height: 2rem;
    width: 2rem;
  }
`;
