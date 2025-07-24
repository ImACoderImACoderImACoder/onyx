import React, { useState } from 'react';
import styled from 'styled-components';

const CopyBtn = styled.button`
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
  min-width: 60px;
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

export default function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <CopyBtn onClick={handleCopy} disabled={!text || text === 'Loading...'}>
      {copied ? (
        <>
          ✓ Copied
        </>
      ) : (
        <>
          📋 {label}
        </>
      )}
    </CopyBtn>
  );
}