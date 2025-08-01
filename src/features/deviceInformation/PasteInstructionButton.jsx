import React, { useState } from 'react';
import styled from 'styled-components';

const InstructionBtn = styled.button`
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme.primaryFontColor};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.2)'};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.primaryColor || 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const InstructionText = styled.div`
  margin-top: 8px;
  font-size: 0.8rem;
  opacity: 0.7;
  color: ${props => props.theme.secondaryFontColor || props.theme.primaryFontColor};
  text-align: center;
`;

export default function PasteInstructionButton({ textAreaRef }) {
  const [showInstruction, setShowInstruction] = useState(false);

  const handleClick = async () => {
    // First try modern clipboard API
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && textAreaRef?.current) {
          textAreaRef.current.value = text;
          textAreaRef.current.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }
      }
    } catch (err) {
      // Clipboard API failed, show instructions
    }

    // Focus the text area and show instructions
    if (textAreaRef?.current) {
      textAreaRef.current.focus();
    }
    
    setShowInstruction(true);
    setTimeout(() => setShowInstruction(false), 5000);
  };

  return (
    <div>
      <InstructionBtn onClick={handleClick}>
        📋 Quick Paste
      </InstructionBtn>
      {showInstruction && (
        <InstructionText>
          Use Ctrl+V (or Cmd+V on Mac) to paste into the text area above
        </InstructionText>
      )}
    </div>
  );
}