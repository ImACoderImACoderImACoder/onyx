import ItemTypes from "./Types";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { useDispatch } from "react-redux";
import { setCurrentWorkflows } from "../../settings/settingsSlice";

export default function WorkflowDrop(props) {
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();

  const [{ isOver, item }, drop] = useDrop(
    () => ({
      accept: ItemTypes.WORKFLOW,
      drop: (item) => {
        const newConfig = cloneDeep(config);
        if (props.itemId === 0) {
          const indexToBeDelete = newConfig.workflows.findIndex(
            (r) => r.id === item.id
          );
          const movedItem = newConfig.workflows.splice(indexToBeDelete, 1);
          newConfig.workflows.unshift(movedItem[0]);
        } else {
          const indexToBeDelete = newConfig.workflows.findIndex(
            (r) => r.id === item.id
          );
          const movedItem = newConfig.workflows.splice(indexToBeDelete, 1);

          const destinationIndex =
            indexToBeDelete < props.itemId ? props.itemId - 1 : props.itemId;

          newConfig.workflows.splice(destinationIndex, 0, movedItem[0]);
        }
        newConfig.workflows.forEach((item, index) => (item.id = index + 1));
        WriteNewConfigToLocalStorage(newConfig);
        dispatch(setCurrentWorkflows(newConfig.workflows));
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
        height: isOver && canDrop ? "70px" : "15px",
        flexGrow: "1",
      }}
    ></div>
  );
}
