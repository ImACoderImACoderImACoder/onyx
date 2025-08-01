import PrideText from "../../themes/PrideText";
import styled from "styled-components";

const TipsContainer = styled.div`
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const TipsHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
`;

const TipCard = styled.div`
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    padding: 18px;
  }
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const TipIcon = styled.span`
  font-size: 1.5rem;
  opacity: 0.8;
`;

const TipTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.primaryColor || props.theme.primaryFontColor};

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TipContent = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${props => props.theme.primaryFontColor};
  opacity: 0.9;

  @media (min-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

export default function WorkflowTips() {
  const tips = [
    {
      icon: "🌪️",
      title: "Fan On Global",
      content: "\"Fan On Global\" is a single value across all workflows. Use this to adjust your main fan time for all workflows."
    },
    {
      icon: "💡",
      title: "LED Display Control",
      content: "If you set the LED brightness to 0 it completely turns off the display."
    },
    {
      icon: "♾️",
      title: "Infinite Fan Mode",
      content: "If you set fan on to 0 it will keep the fan on indefinitely. To turn the fan off use another fan on command with a small value (e.g. 0.1)."
    },
    {
      icon: "⏸️",
      title: "Manual Pause",
      content: "Set the pause/wait flow to 0 and it will wait until you click \"okay\" to resume the workflow execution."
    },
    {
      icon: "📱",
      title: "Drag & Drop",
      content: "You can re-order workflows by dragging the move icon (✛) to another position in the list."
    },
    {
      icon: "🔄",
      title: "Background Mode",
      content: "If you are using workflows on a phone or tablet they may not run in the background. If they stop running they will resume when the app is opened."
    }
  ];

  return (
    <TipsContainer>
      <TipsHeader>
        <h2>
          <PrideText text="💡 Workflow Tips & Tricks" />
        </h2>
      </TipsHeader>
      <TipsGrid>
        {tips.map((tip, index) => (
          <TipCard key={index}>
            <TipHeader>
              <TipIcon>{tip.icon}</TipIcon>
              <TipTitle>{tip.title}</TipTitle>
            </TipHeader>
            <TipContent>{tip.content}</TipContent>
          </TipCard>
        ))}
      </TipsGrid>
    </TipsContainer>
  );
}
