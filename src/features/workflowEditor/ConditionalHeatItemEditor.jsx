import { StyledLabel } from "./WorkflowItemEditor";
import StyledControl from "../shared/styledComponents/FormControl";
import Control from "react-bootstrap/FormControl";

export default function ConditionalHeatItemEditor() {
  return (
    <>
      <div>
        <StyledLabel style={{ minWidth: "fit-content" }}>
          If Heat isn't specified set heat to
        </StyledLabel>
        <StyledControl
          type="number"
          inputMode="decimal"
          value={3}
          onChange={(e) => console.log(e)}
          onBlur={() => {}}
          isValid={false}
          isInvalid={true}
        />
        <Control.Feedback type="invalid">error</Control.Feedback>

        <StyledLabel style={{ minWidth: "fit-content" }}>
          If Heat isn't specified set heat to
        </StyledLabel>
        <StyledControl
          type="number"
          inputMode="decimal"
          value={3}
          onChange={(e) => console.log(e)}
          onBlur={() => {}}
          isValid={false}
          isInvalid={true}
        />
        <Control.Feedback type="invalid">error 2</Control.Feedback>
      </div>
    </>
  );
}
