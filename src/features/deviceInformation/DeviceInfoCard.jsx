import React from 'react';
import styled from 'styled-components';
import PrideText from '../../themes/PrideText';
import CopyButton from './CopyButton';

const Card = styled.div`
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 20px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const Icon = styled.span`
  font-size: 1.3rem;
  opacity: 0.8;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 12px;
    flex-wrap: nowrap;
  }
`;

const Value = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.primaryColor || props.theme.primaryFontColor};
  font-family: 'Courier New', monospace;
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.05)'};
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  word-break: break-all;
  flex: 1;
  min-width: 0;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    padding: 8px 12px;
    word-break: normal;
  }
`;

const Description = styled.p`
  margin: 8px 0 0 0;
  font-size: 0.8rem;
  opacity: 0.7;
  color: ${props => props.theme.secondaryFontColor || props.theme.primaryFontColor};
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

export default function DeviceInfoCard({ icon, title, value, description }) {
  return (
    <Card>
      <CardHeader>
        <Icon>{icon}</Icon>
        <Title>
          <PrideText text={title} />
        </Title>
      </CardHeader>
      <ValueContainer>
        <Value>{value || 'Loading...'}</Value>
        <CopyButton text={value} />
      </ValueContainer>
      {description && <Description>{description}</Description>}
    </Card>
  );
}