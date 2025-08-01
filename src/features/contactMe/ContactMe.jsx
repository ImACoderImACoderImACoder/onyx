import Contact from "./Contact";
import Div from "../shared/styledComponents/RootNonAppOutletDiv";
import Socials from "./Meta/Socials";
import PrideText from "../../themes/PrideText";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const ContactHeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  
  h1 {
    margin-bottom: 16px;
    font-size: 2.5rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
`;

const ContactDescription = styled.p`
  color: ${props => props.theme.primaryFontColor};
  opacity: 0.8;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContactSectionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
    gap: 32px;
  }
`;

export default function ContactMe() {
  const { t } = useTranslation();
  
  return (
    <Div>
      <ContactHeaderContainer>
        <h1>
          <PrideText text={t("contactPage.title")} />
        </h1>
        <ContactDescription>
          Get in touch! Whether you have feature requests, feedback, or just want to say hello, 
          I'd love to hear from you. Connect through social media or send a direct message.
        </ContactDescription>
      </ContactHeaderContainer>
      
      <ContactSectionsContainer>
        <Socials />
        <Contact />
      </ContactSectionsContainer>
    </Div>
  );
}
