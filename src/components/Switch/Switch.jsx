import { useEffect, useState } from "react";
import styled from "styled-components";

const SwitchParentDiv = styled.div`
  display: flex;
  flex-grow: 1;
`;
const Switch = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-grow: 1;
  font-weight: 400;
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
  font-weight: 400;
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

  color: ${(props) => props.theme.ToggleButtons.onColor};
  background-color: ${(props) => props.theme.ToggleButtons.onBackgroundColor};
  border-color: ${(props) => props.theme.ToggleButtons.onBorderColor};

  font-size: xx-large;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const SwitchOffState = styled(SwitchOnState)`
  color: ${(props) => props.theme.ToggleButtons.offColor};
  background-color: ${(props) => props.theme.ToggleButtons.offBackgroundColor};
  border-color: ${(props) => props.theme.ToggleButtons.offBorderColor};
  left: 50%;
  right: 0;
`;

const SwitchHandle = styled(SwitchOnState)`
  position: relative;
  margin: 0 auto;
  padding-top: 0px;
  padding-bottom: 0px;
  height: 100%;
  width: 0px;
  border-width: 0 1px;

  color: #000;
  background-color: ${(props) =>
    props.theme.ToggleButtons.sliderBackgroundColor};
  border-color: ${(props) => props.theme.ToggleButtons.sliderBorderColor};
`;

function ToggleSwitch(props) {
  const [isOn, setIsOn] = useState(props.isToggleOn);

  useEffect(() => {
    setIsOn(props.isToggleOn);
  }, [props.isToggleOn]);

  return (
    <SwitchParentDiv onClick={() => setIsOn((oldIsOn) => !oldIsOn)}>
      <Switch>
        <SwitchDiv
          style={{
            left: isOn ? "0" : "-100%",
          }}
        >
          <SwitchOnState>{props.onText}</SwitchOnState>
          <SwitchOffState>{props.offText}</SwitchOffState>
          <SwitchHandle />
        </SwitchDiv>
      </Switch>
    </SwitchParentDiv>
  );
}

ToggleSwitch.defaultProps = {
  onText: "On",
  offText: "Off",
  isToggleOn: false,
};

export default ToggleSwitch;
