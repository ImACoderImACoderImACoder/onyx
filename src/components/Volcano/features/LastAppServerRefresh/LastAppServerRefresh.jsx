export default function LastAppServerRefresh() {
  var currentdate = new Date();
  var dateTime =
    "Last Synced: " +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return <div>{dateTime}</div>;
}
