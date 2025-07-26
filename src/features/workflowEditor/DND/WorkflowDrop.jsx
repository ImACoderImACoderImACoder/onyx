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
  const isDragging = !!item;
  
  return (
    <div
      ref={drop}
      style={{
        height: isDragging ? "50px" : "8px",
        backgroundColor: isOver && canDrop ? `${theme.buttonActive.backgroundColor}80` : 'transparent',
        border: isOver && canDrop 
          ? `2px solid ${theme.buttonActive.borderColor}` 
          : isDragging 
            ? `1px dashed ${theme.borderColor}60`
            : '1px dashed transparent',
        borderRadius: isDragging ? "8px" : "4px",
        flexGrow: "1",
        transition: "all 0.2s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        margin: "4px 0",
        maxWidth: "100%",
        overflow: "hidden",
        ...(isOver && canDrop && {
          backgroundColor: theme.buttonActive.backgroundColor,
          boxShadow: `0 2px 12px ${theme.buttonActive.borderColor}50`,
          transform: "scaleY(1.15)",
        }),
      }}
    >
      {isOver && canDrop && (
        <span style={{
          color: theme.buttonActive.color,
          fontSize: "0.9rem",
          fontWeight: "600",
          opacity: "0.8",
          pointerEvents: "none",
          textAlign: "center",
          whiteSpace: "nowrap"
        }}>
          📍 Drop workflow here
        </span>
      )}
      {isDragging && !isOver && canDrop && (
        <span style={{
          color: theme.primaryFontColor,
          fontSize: "0.8rem",
          fontWeight: "500",
          opacity: "0.5",
          pointerEvents: "none",
          textAlign: "center",
          whiteSpace: "nowrap"
        }}>
          ↕️ Drop zone
        </span>
      )}
    </div>
  );
}
