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
  background: linear-gradient(145deg, ${(props) => props.theme.buttonColorMain}, ${(props) => props.theme.buttonColorMain}cc);
  color: ${(props) => props.theme.primaryFontColor};
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(0, 0, 0, 0.2);
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
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
  background: linear-gradient(145deg, ${(props) => props.theme.plusMinusButtons.backgroundColor}, ${(props) => props.theme.plusMinusButtons.backgroundColor}cc);
  color: ${(props) => props.theme.plusMinusButtons.color};
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(0, 0, 0, 0.2);
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
  }
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
