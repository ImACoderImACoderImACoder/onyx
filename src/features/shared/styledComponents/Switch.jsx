import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GetTheme from "../../../themes/ThemeProvider";
import styled from "styled-components";

const SwitchParentDiv = styled.div`
  display: flex;
  flex-grow: 1;
  z-index: 1;
`;
const Switch = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-grow: 1;
  font-weight: 700;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;

const SwitchDiv = styled.div`
  position: absolute;
  width: 200%;
  top: 0;
  bottom: 0;
  left: 0;
  transition: left 0.35s;
  -webkit-transition: left 0.35s;
`;

const SwitchOnState = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 50%;
  margin: 0;
  border: 0;
  border-radius: 0;

  display: inline-block;
  font-weight: 700;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 2px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  color: ${(props) => props.theme.ToggleButtons.onColor};
  background: ${(props) => props.theme.ToggleButtons.onBackgroundColor};
  border-color: ${(props) => props.theme.ToggleButtons.onBorderColor};
  text-shadow: 1px 1px black;
  font-size: xx-large;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const SwitchOffState = styled(SwitchOnState)`
  color: ${(props) => props.theme.ToggleButtons.offColor};
  background: ${(props) => props.theme.ToggleButtons.offBackgroundColor};
  border-color: ${(props) => props.theme.ToggleButtons.offBorderColor};
  left: 50%;
  right: 0;
`;

const OnSwitchWithBackgroundImage = styled(SwitchOnState)`
  background: none;
  background-color: ${(props) =>
    props.theme.ToggleButtons.backgroundImageColorOn};
  background-image: ${(props) => props.theme.ToggleButtons.backgroundImageOn};
  background-blend-mode: ${(props) =>
    props.theme.ToggleButtons.backgroundBlendModeOn};
`;

const OffSwitchWithBackgroundImage = styled(SwitchOffState)`
  background: none;
  background-image: ${(props) => props.theme.ToggleButtons.backgroundImageOff};
  background-color: ${(props) =>
    props.theme.ToggleButtons.backgroundImageColorOff};
  background-blend-mode: ${(props) =>
    props.theme.ToggleButtons.backgroundBlendModeOff};
`;

const SwitchHandleOn = styled(SwitchOnState)`
  position: relative;
  margin: 0 auto;
  padding-top: 0px;
  padding-bottom: 0px;
  height: 100%;
  width: 0px;
  border-width: 0 1px;

  color: #000;
  background: ${(props) => props.theme.ToggleButtons.sliderBackgroundColorOn};
  border-color: ${(props) => props.theme.ToggleButtons.sliderBorderColor};
`;

const SwitchHandleOff = styled(SwitchHandleOn)`
  background: ${(props) =>
    props.theme.ToggleButtons.sliderBackgroundColorOff ||
    props.theme.ToggleButtons.sliderBackgroundColorOnOn};
`;

const ToggleSwitch = React.forwardRef((props, ref) => {
  const [isOn, setIsOn] = useState(props.isToggleOn);
  const [SwitchHandle, setSwitchHandle] = useState(SwitchHandleOff);

  useEffect(() => {
    setIsOn(props.isToggleOn);
  }, [props.isToggleOn]);

  useEffect(() => {
    if (!isOn) {
      setSwitchHandle(SwitchHandleOn);
    } else {
      setSwitchHandle(SwitchHandleOff);
    }
  }, [isOn]);

  const themeId = useSelector(
    (state) => state.settings.config?.currentTheme || GetTheme().themeId
  );

  const currentTheme = GetTheme(themeId);

  const OnButton = currentTheme.ToggleButtons.backgroundImageOn
    ? OnSwitchWithBackgroundImage
    : SwitchOnState;

  const OffButton = currentTheme.ToggleButtons.backgroundImageOff
    ? OffSwitchWithBackgroundImage
    : SwitchOffState;
  return (
    <SwitchParentDiv
      ref={ref}
      onClick={() =>
        setIsOn((oldIsOn) => {
          const nextState = !oldIsOn;
          props.onChange(nextState);
          return nextState;
        })
      }
    >
      <Switch>
        <SwitchDiv
          style={{
            left: isOn ? "0" : "-100%",
          }}
        >
          <OnButton>{props.onText}</OnButton>
          <OffButton>{props.offText}</OffButton>
          <SwitchHandle />
        </SwitchDiv>
      </Switch>
    </SwitchParentDiv>
  );
});

ToggleSwitch.defaultProps = {
  onText: "On",
  offText: "Off",
  isToggleOn: false,
  onChange: () => {},
};

export default ToggleSwitch;
