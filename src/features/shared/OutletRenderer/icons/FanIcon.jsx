import React from "react";
import styled, { useTheme } from "styled-components";

const StyledSVG = styled.svg`
  width: ${(props) => props.size || "1em"};
  height: ${(props) => props.size || "1em"};
  fill: currentColor;
`;

export default function FanIcon({ size }) {
  const theme = useTheme();
  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      size={size}
    >
      <path d="M224 208C224 128.5 288.5 64 368 64C376.8 64 384 71.2 384 80L384 232.2C399 226.9 415.2 224 432 224C511.5 224 576 288.5 576 368C576 376.8 568.8 384 560 384L407.8 384C413.1 399 416 415.2 416 432C416 511.5 351.5 576 272 576C263.2 576 256 568.8 256 560L256 407.8C241 413.1 224.8 416 208 416C128.5 416 64 351.5 64 272C64 263.2 71.2 256 80 256L232.2 256C226.9 241 224 224.8 224 208zM320 352C337.7 352 352 337.7 352 320C352 302.3 337.7 288 320 288C302.3 288 288 302.3 288 320C288 337.7 302.3 352 320 352z"/>
    </StyledSVG>
  );
}