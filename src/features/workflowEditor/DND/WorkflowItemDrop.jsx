import ItemTypes from "./Types";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { useDispatch } from "react-redux";
import { setCurrentWorkflows } from "../../settings/settingsSlice";
import { useTheme } from "styled-components";

export default function WorkflowItemDrop(props) {
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();
  const theme = useTheme();

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
        height: isOver && canDrop ? "70px" : "12px",
        backgroundColor: isOver && canDrop ? theme.buttonActive.backgroundColor : 'transparent',
        border: isOver && canDrop ? `2px dashed ${theme.buttonActive.borderColor}` : '1px dashed transparent',
        borderRadius: "8px",
        flexGrow: "1",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        margin: "6px 0",
        ...(isOver && canDrop && {
          boxShadow: `0 2px 12px ${theme.buttonActive.borderColor}30`,
          transform: "scale(1.01)",
        }),
      }}
    >
      {isOver && canDrop && (
        <div style={{
          color: theme.buttonActive.color,
          fontSize: "0.8rem",
          fontWeight: "500",
          opacity: "0.8",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          ⬇️ Drop action here
        </div>
      )}
    </div>
  );
}
