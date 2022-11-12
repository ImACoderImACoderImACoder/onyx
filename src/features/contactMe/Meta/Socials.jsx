import styled from "styled-components";
import * as links from "../../../constants/constants";
import PrideText from "../../../themes/PrideText";
import CashAppIcon from "../../shared/OutletRenderer/icons/brands/CashAppIcon";
import GithubIcon from "../../shared/OutletRenderer/icons/brands/GithubIcon";
import InstagramIcon from "../../shared/OutletRenderer/icons/brands/InstagramIcon";
import PatreonIcon from "../../shared/OutletRenderer/icons/brands/PatreonIcon";
import RedditIcon from "../../shared/OutletRenderer/icons/brands/RedditIcon";
import TwitterIcon from "../../shared/OutletRenderer/icons/brands/TwitterIcon";

const Div = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledA = styled.a`
  max-width: min-content;
  text-decoration: none;
  color: ${(props) => props.theme.primaryFontColor};
`;

const SocialDiv = styled.div`
  display: flex;
  align-items: center;
`;

export default function Socials() {
  return (
    <Div>
      <h2>
        <PrideText text="Socials" />
      </h2>
      <StyledA href={links.githubLink} target="_blank" rel="noreferrer">
        <SocialDiv>
          <GithubIcon />
          Github
        </SocialDiv>
      </StyledA>
      <StyledA href={links.redditLink} target="_blank" rel="noreferrer">
        <SocialDiv>
          <RedditIcon />
          Reddit
        </SocialDiv>
      </StyledA>
      <StyledA href={links.twitterLink} target="_blank" rel="noreferrer">
        <SocialDiv>
          <TwitterIcon />
          Twitter
        </SocialDiv>
      </StyledA>
      <StyledA href={links.instagramLink} target="_blank" rel="noreferrer">
        <SocialDiv>
          <InstagramIcon />
          Instagram
        </SocialDiv>
      </StyledA>
      <div>
        <StyledA href={links.cashAppLink} target="_blank" rel="noreferrer">
          <SocialDiv>
            <CashAppIcon />
            Cash App
          </SocialDiv>
        </StyledA>
      </div>
      <StyledA href={links.patreonLink} target="_blank" rel="noreferrer">
        <SocialDiv>
          <PatreonIcon />
          Patreon
        </SocialDiv>
      </StyledA>
    </Div>
  );
}
