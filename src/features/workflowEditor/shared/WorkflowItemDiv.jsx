import styled from "styled-components";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-radius: 0.25rem;
  padding: 10px;
  flex-grow: 1;
  border-color: ${(props) => props.theme.borderColor};
`;

export default Div;
