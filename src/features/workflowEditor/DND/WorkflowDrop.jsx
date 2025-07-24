import ItemTypes from "./Types";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { useDispatch } from "react-redux";
import { setCurrentWorkflows } from "../../settings/settingsSlice";
import { useTheme } from "styled-components";

export default function WorkflowDrop(props) {
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [{ isOver, item }, drop] = useDrop(
    () => ({
      accept: ItemTypes.WORKFLOW,
      drop: (item) => {
        const newConfig = cloneDeep(config);
        if (props.itemId === 0) {
          const indexToBeDelete = newConfig.workflows.items.findIndex(
            (r) => r.id === item.id
          );
          const movedItem = newConfig.workflows.items.splice(
            indexToBeDelete,
            1
          );
          newConfig.workflows.items.unshift(movedItem[0]);
        } else {
          const indexToBeDelete = newConfig.workflows.items.findIndex(
            (r) => r.id === item.id
          );
          const movedItem = newConfig.workflows.items.splice(
            indexToBeDelete,
            1
          );

          const destinationIndex =
            indexToBeDelete < props.itemId ? props.itemId - 1 : props.itemId;

          newConfig.workflows.items.splice(destinationIndex, 0, movedItem[0]);
        }
        newConfig.workflows.items.forEach(
          (item, index) => (item.id = index + 1)
        );
        WriteNewConfigToLocalStorage(newConfig);
        dispatch(setCurrentWorkflows(newConfig.workflows.items));
      },
      canDrop: (item) => {
        return item?.id !== props.itemId && item?.id - 1 !== props.itemId;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        item: monitor.getItem(),
      }),
    }),
    [props.itemId, dispatch, config]
  );

  const canDrop = item?.id !== props.itemId && item?.id - 1 !== props.itemId;
  return (
    <div
      ref={drop}
      style={{
        height: isOver && canDrop ? "80px" : "16px",
        backgroundColor: isOver && canDrop ? theme.buttonActive.backgroundColor : 'transparent',
        border: isOver && canDrop ? `2px dashed ${theme.buttonActive.borderColor}` : '2px dashed transparent',
        borderRadius: "12px",
        flexGrow: "1",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        margin: "8px 0",
        ...(isOver && canDrop && {
          boxShadow: `0 4px 20px ${theme.buttonActive.borderColor}40`,
          transform: "scale(1.02)",
        }),
      }}
    >
      {isOver && canDrop && (
        <div style={{
          color: theme.buttonActive.color,
          fontSize: "0.9rem",
          fontWeight: "600",
          opacity: "0.8",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          📍 Drop workflow here
        </div>
      )}
    </div>
  );
}
