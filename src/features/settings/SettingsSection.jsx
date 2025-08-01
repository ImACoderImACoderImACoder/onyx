import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import PrideText from '../../themes/PrideText';

const SectionContainer = styled.div`
  margin-bottom: 30px;
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 16px;
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  transition: all 0.3s ease;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ExpandIcon = styled.div`
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
  border: none !important;
  color: ${props => props.theme.iconColor || props.theme.primaryFontColor} !important;
  width: 2rem;
  height: 2rem;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1;
`;

const SectionContent = styled.div`
  margin-top: ${props => props.isExpanded ? '20px' : '0'};
  max-height: ${props => props.isExpanded ? '2000px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isExpanded ? '1' : '0'};
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.secondaryFontColor || props.theme.primaryFontColor};
  opacity: 0.8;
  margin: 0 0 20px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export default function SettingsSection({ title, description, children, icon, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const theme = useTheme();

  return (
    <SectionContainer>
      <SectionHeader onClick={() => setIsExpanded(!isExpanded)}>
        <SectionTitle>
          {icon && <span>{icon}</span>}
          <PrideText text={title} />
        </SectionTitle>
        <ExpandIcon isExpanded={isExpanded} theme={theme}>
          <svg width="16" height="16" viewBox="0 0 12 12" style={{ fill: theme.iconColor || theme.primaryFontColor }}>
            <path d="M3 2L9 6L3 10V2Z" />
          </svg>
        </ExpandIcon>
      </SectionHeader>
      <SectionContent isExpanded={isExpanded}>
        {description && <SectionDescription>{description}</SectionDescription>}
        {children}
      </SectionContent>
    </SectionContainer>
  );
}