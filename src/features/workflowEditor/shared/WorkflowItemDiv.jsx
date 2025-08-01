import styled from "styled-components";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  padding: 20px;
  flex-grow: 1;
  background: ${(props) => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.05)'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${(props) => props.theme.primaryColor || props.theme.borderColor} 0%, 
      ${(props) => props.theme.iconColor || props.theme.borderColor} 100%
    );
    opacity: 0.6;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: ${(props) => props.theme.primaryColor || props.theme.borderColor};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:focus-within {
    border-color: ${(props) => props.theme.buttonActive.borderColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.buttonActive.borderColor}33;
  }
`;

export default Div;
