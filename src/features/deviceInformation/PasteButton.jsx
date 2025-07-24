import React, { useState } from 'react';
import styled from 'styled-components';

const PasteBtn = styled.button`
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme.primaryFontColor};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.2)'};
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 70px;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.primaryColor || 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function PasteButton({ onPaste, label = 'Paste' }) {
  const [pasted, setPasted] = useState(false);
  const [error, setError] = useState(false);

  const handlePaste = async () => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      
      const text = await navigator.clipboard.readText();
      if (onPaste && text) {
        onPaste(text);
        setPasted(true);
        setError(false);
        setTimeout(() => setPasted(false), 2000);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setError(true);
      setTimeout(() => setError(false), 3000);
      
      // Show instructions to user
      alert('Clipboard access failed. Please use Ctrl+V (or Cmd+V on Mac) to paste into the text area.');
    }
  };

  return (
    <PasteBtn onClick={handlePaste}>
      {error ? (
        <>
          ❌ Failed
        </>
      ) : pasted ? (
        <>
          ✓ Pasted
        </>
      ) : (
        <>
          📋 {label}
        </>
      )}
    </PasteBtn>
  );
}