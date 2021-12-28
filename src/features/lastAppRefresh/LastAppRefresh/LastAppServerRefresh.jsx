import { useSelector } from "react-redux";

export default function LastAppServerRefresh() {
  const lastAppServerRefresh = useSelector(
    (state) => state.lastAppRefresh.appInitializedTimestamp
  );

  return <div>{lastAppServerRefresh}</div>;
}
