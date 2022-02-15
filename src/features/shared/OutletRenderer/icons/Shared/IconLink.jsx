import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledRouterIconLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.iconTextColor};
  text-align: center;
`;

export { StyledRouterIconLink };
