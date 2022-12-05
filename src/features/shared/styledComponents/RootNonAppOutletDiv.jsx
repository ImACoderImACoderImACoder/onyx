import styled from "styled-components";
import Container from "react-bootstrap/Container";

const Div = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

  h1 {
    color: ${(props) => props.theme.iconColor};
  }
`;

export default function SectionRootDiv(props) {
  return (
    <Div {...props}>
      <Container>{props.children}</Container>
    </Div>
  );
}
