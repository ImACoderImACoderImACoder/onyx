import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";

export default function DisplayOnCoolingToggle(props) {
  return (
    <Div>
      <h2>Volcano shows temperature when the heat is turned off</h2>
      <div onClick={props.onChange}>
        <StyledToggleSwitch isToggleOn={props.isDisplayOnCooling} />
      </div>
    </Div>
  );
}
