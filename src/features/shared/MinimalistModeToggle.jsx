import { useDispatch, useSelector } from "react-redux";
import { setIsMinimalistMode } from "../settings/settingsSlice";
import styled from "styled-components";
import Button from "./styledComponents/Button";

const MinimalistButton = styled(Button)`
  padding: 8px 16px;
  font-size: 14px;
  background-color: ${(props) => props.theme.secondaryBackgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  margin: 5px;
  
  &:hover {
    background-color: ${(props) => props.theme.hoverBackgroundColor};
  }
`;

export default function MinimalistModeToggle() {
  const dispatch = useDispatch();
  const isMinimalistMode = useSelector((state) => state.settings.isMinimalistMode);

  const handleToggle = () => {
    dispatch(setIsMinimalistMode(!isMinimalistMode));
  };

  return (
    <MinimalistButton onClick={handleToggle}>
      {isMinimalistMode ? "Exit Minimalist" : "Minimalist Mode"}
    </MinimalistButton>
  );
}