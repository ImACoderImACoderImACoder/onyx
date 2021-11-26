import FOrC from "./FOrC";
export default function FOrCLoader(props) {
  const { isLoading, ...restProps } = props;
  if (props.isLoading) {
    return <div>Loading...</div>;
  }
  return <FOrC {...restProps} />;
}
