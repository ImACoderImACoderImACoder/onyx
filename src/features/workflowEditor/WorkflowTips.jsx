import PrideText from "../../themes/PrideText";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
  const tips = [
    {
      icon: "🌪️",
      title: t("workflowTips.fanOnGlobal.title"),
      content: t("workflowTips.fanOnGlobal.content")
    },
    {
      icon: "💡",
      title: t("workflowTips.ledDisplay.title"),
      content: t("workflowTips.ledDisplay.content")
    },
    {
      icon: "♾️",
      title: t("workflowTips.infiniteFan.title"),
      content: t("workflowTips.infiniteFan.content")
    },
    {
      icon: "⏸️",
      title: t("workflowTips.manualPause.title"),
      content: t("workflowTips.manualPause.content")
    },
    {
      icon: "📱",
      title: t("workflowTips.dragDrop.title"),
      content: t("workflowTips.dragDrop.content")
    },
    {
      icon: "🔄",
      title: t("workflowTips.backgroundMode.title"),
      content: t("workflowTips.backgroundMode.content")
    }
  ];

  return (
    <TipsContainer>
      <TipsHeader>
        <h2>
          <PrideText text={t("workflowTips.title")} />
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
