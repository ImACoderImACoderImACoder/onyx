import { useSelector } from "react-redux";
import styled from "styled-components";

const Div = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
`;

export default function LastAppServerRefresh() {
  const lastAppServerRefresh = useSelector(
    (state) => state.lastAppRefresh.appInitializedTimestamp
  );

  return <Div>{lastAppServerRefresh}</Div>;
}
