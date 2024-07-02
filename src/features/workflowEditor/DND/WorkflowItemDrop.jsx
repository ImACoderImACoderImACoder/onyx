import ItemTypes from "./Types";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { useDispatch } from "react-redux";
import { setCurrentWorkflows } from "../../settings/settingsSlice";

export default function WorkflowItemDrop(props) {
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();

  const [{ isOver, item }, drop] = useDrop(
    () => ({
      accept: ItemTypes.WORKFLOW_ITEM,
      drop: (item) => {
        const newConfig = cloneDeep(config);
        const workflowIndex = newConfig.workflows.items.findIndex(
          (wf) => wf.id === item.workflowId
        );
        const workflow = newConfig.workflows.items[workflowIndex];

        if (props.itemIndex === 0) {
          const movedItem = workflow.payload.splice(item.itemIndex, 1);
          workflow.payload.unshift(movedItem[0]);
        } else {
          const movedItem = workflow.payload.splice(item.itemIndex, 1);

          const destinationIndex =
            item.itemIndex < props.itemIndex
              ? props.itemIndex - 1
              : props.itemIndex;
          workflow.payload.splice(destinationIndex, 0, movedItem[0]);
        }
        workflow.payload.forEach(
          (item, index) => (item.id = index + Date.now())
        );
        newConfig.workflows.items[workflowIndex] = workflow;
        WriteNewConfigToLocalStorage(newConfig);
        dispatch(setCurrentWorkflows(newConfig.workflows.items));
      },
      canDrop: (item) => {
        return (
          item?.itemIndex !== props.itemIndex &&
          item?.itemIndex + 1 !== props.itemIndex
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        item: monitor.getItem(),
      }),
    }),
    [props.itemId, dispatch, config]
  );

  const canDrop =
    item?.itemIndex !== props.itemIndex &&
    item?.itemIndex + 1 !== props.itemIndex;
  return (
    <div
      ref={drop}
      style={{
        height: isOver && canDrop ? "70px" : "20px",
        flexGrow: "1",
      }}
    ></div>
  );
}
