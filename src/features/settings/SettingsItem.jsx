import React from 'react';
import styled from 'styled-components';
import PrideText from '../../themes/PrideText';

const ItemContainer = styled.div`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.hasDescription ? '8px' : '0'};
`;

const ItemTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ItemDescription = styled.p`
  color: ${props => props.theme.secondaryFontColor || props.theme.primaryFontColor};
  opacity: 0.7;
  margin: 0 0 12px 0;
  font-size: 0.85rem;
  line-height: 1.4;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: ${props => props.align || 'flex-start'};
  align-items: center;
`;

export default function SettingsItem({ title, description, children, controlAlign }) {
  return (
    <ItemContainer>
      <ItemHeader hasDescription={!!description}>
        <ItemTitle>
          <PrideText text={title} />
        </ItemTitle>
        {!description && children}
      </ItemHeader>
      {description && (
        <>
          <ItemDescription>{description}</ItemDescription>
          <ControlContainer align={controlAlign}>
            {children}
          </ControlContainer>
        </>
      )}
    </ItemContainer>
  );
}