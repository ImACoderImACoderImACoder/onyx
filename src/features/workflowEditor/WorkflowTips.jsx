import PrideText from "../../themes/PrideText";

export default function WorkflowTips() {
  return (
    <div>
      <h2>
        <PrideText text="Workflow Tips" />
      </h2>
      <ul>
        <li>
          If you set the Led brightness to 0 it completely turns off the display
        </li>
        <li>
          Set the pause/wait flow to 0 and it will wait until you click "okay"
          to resume the workflow execution
        </li>
        <li>
          You can re-order work flows by long tapping the workflow and dragging
          it to another spot in the list
        </li>
        <li>
          If you are using workflows on a phone or tablet they may not run in
          the background. If they stop running they will resume when the app is
          opened
        </li>
      </ul>
    </div>
  );
}
