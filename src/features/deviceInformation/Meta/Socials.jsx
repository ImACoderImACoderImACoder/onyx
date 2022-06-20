import styled from "styled-components";
import * as links from "../../../constants/constants";
import PrideText from "../../../themes/PrideText";

const Div = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledA = styled.a`
  max-width: min-content;
`;

export default function Socials() {
  return (
    <Div>
      <h1><PrideText text="Socials"/></h1>
      <StyledA href={links.githubLink} target="_blank" rel="noreferrer">
        Github
      </StyledA>
      <StyledA href={links.patreonLink} target="_blank" rel="noreferrer">
        Patreon
      </StyledA>
      <StyledA href={links.redditLink} target="_blank" rel="noreferrer">
        Reddit
      </StyledA>
      <StyledA href={links.twitterLink} target="_blank" rel="noreferrer">
        Twitter
      </StyledA>
      <StyledA href={links.instagramLink} target="_blank" rel="noreferrer">
        Instagram
      </StyledA>
    </Div>
  );
}
