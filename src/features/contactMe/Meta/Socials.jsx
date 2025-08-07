import styled from "styled-components";
import * as links from "../../../constants/constants";
import PrideText from "../../../themes/PrideText";
import CashAppIcon from "../../shared/OutletRenderer/icons/brands/CashAppIcon";
import GithubIcon from "../../shared/OutletRenderer/icons/brands/GithubIcon";
import InstagramIcon from "../../shared/OutletRenderer/icons/brands/InstagramIcon";
import PatreonIcon from "../../shared/OutletRenderer/icons/brands/PatreonIcon";
import RedditIcon from "../../shared/OutletRenderer/icons/brands/RedditIcon";
import TwitterIcon from "../../shared/OutletRenderer/icons/brands/TwitterIcon";
import { useTranslation } from "react-i18next";

const SocialsContainer = styled.div`
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
`;

const SocialsHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
  
  h2 {
    margin-bottom: 8px;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const SocialsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledA = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.primaryFontColor};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${(props) => props.theme.primaryColor || props.theme.primaryFontColor};
    transform: translateX(4px);
  }
`;

const SocialDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.primaryColor || 'rgba(255, 255, 255, 0.1)'};
    border-color: ${props => props.theme.primaryColor || props.theme.borderColor};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  span {
    font-weight: 500;
    font-size: 0.95rem;
  }
`;

export default function Socials() {
  const { t } = useTranslation();

  return (
    <SocialsContainer>
      <SocialsHeader>
        <h2>
          <PrideText text={t('social.connectWithMe')} />
        </h2>
      </SocialsHeader>
      <SocialsList>
        <StyledA href={links.githubLink} target="_blank" rel="noreferrer">
          <SocialDiv>
            <GithubIcon />
            <span>{t('social.github')}</span>
          </SocialDiv>
        </StyledA>
        <StyledA href={links.redditLink} target="_blank" rel="noreferrer">
          <SocialDiv>
            <RedditIcon />
            <span>{t('social.reddit')}</span>
          </SocialDiv>
        </StyledA>
        <StyledA href={links.twitterLink} target="_blank" rel="noreferrer">
          <SocialDiv>
            <TwitterIcon />
            <span>{t('social.x')}</span>
          </SocialDiv>
        </StyledA>
        <StyledA href={links.instagramLink} target="_blank" rel="noreferrer">
          <SocialDiv>
            <InstagramIcon />
            <span>{t('social.instagram')}</span>
          </SocialDiv>
        </StyledA>
        <StyledA href={links.cashAppLink} target="_blank" rel="noreferrer">
          <SocialDiv>
            <CashAppIcon />
            <span>{t('social.cashApp')}</span>
          </SocialDiv>
        </StyledA>
        <StyledA href={links.patreonLink} target="_blank" rel="noreferrer">
          <SocialDiv>
            <PatreonIcon />
            <span>{t('social.patreon')}</span>
          </SocialDiv>
        </StyledA>
      </SocialsList>
    </SocialsContainer>
  );
}
