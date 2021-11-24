import FOrC from "./FOrC";
export default function FOrCLoader(props) {
  if (props.isF === undefined || props.isF === null) {
    return <div>Loading...</div>;
  }
  return <FOrC {...props} />;
}
