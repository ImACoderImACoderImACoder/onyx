import styled from "styled-components";
import { patreonLink } from "../../constants/constants";

const Div = styled.div`
  color: ${(props) => props.theme.homePageColor};
`;

export default function Patreon() {
  return (
    <Div>
      If you want to support this project you can on{" "}
      <a href={patreonLink} target="_blank" rel="noreferrer">
        Patreon.
      </a>
    </Div>
  );
}
