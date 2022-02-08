import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";

const Div = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
`;

export default function Loading() {
  return (
    <Div>
      <Spinner animation="border" variant="primary" />
      <Spinner animation="border" variant="secondary" />
      <Spinner animation="border" variant="success" />
      <Spinner animation="border" variant="danger" />
      <Spinner animation="border" variant="warning" />
      <Spinner animation="border" variant="info" />
      <Spinner animation="border" variant="light" />
      <Spinner animation="border" variant="dark" />
      <Div>Establishing BLE Connection</Div>
    </Div>
  );
}
