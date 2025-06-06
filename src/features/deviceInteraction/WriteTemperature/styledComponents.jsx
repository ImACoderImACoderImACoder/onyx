import styled, { css } from "styled-components";

const glowStyles = css`
  ${({ theme }) => {
    return css`
      box-shadow: 0 0 6px ${theme.primaryFontColor},
        0 0 12px ${theme.primaryFontColor};
    `;
  }}
`;

export const InactiveButton = styled.button`
  font-size: 1.25rem;
  min-height: 2.75rem;
  flex-grow: 1;
  border-width: 0.15rem;
  background-color: ${(props) => props.theme.buttonColorMain};
  color: ${(props) => props.theme.primaryFontColor};
  border-radius: 2rem;
  border-color: ${(props) => props.theme.borderColor};
  border-style: ${(props) => props.theme.borderStyle};
  border-width: 0px;
  &:active {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
    border-color: ${(props) => props.theme.buttonActive.borderColor};
  }
`;
export const GlowyInactiveButton = styled(InactiveButton)`
  ${glowStyles}
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
  width: 48%;
  flex-grow: 1;
  margin: 0px 2.5px 8px;

  svg {
    height: 2rem;
    width: 2rem;
  }
`;
