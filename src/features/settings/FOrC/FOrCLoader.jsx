import Spinner from "react-bootstrap/Spinner";
import useIsF from "./UseIsF";

export default function FOrCLoader(props) {
  const isF = useIsF();

  const loadingSpinner = props.useSpinnerToShowLoader && (
    <Spinner animation="border" variant="dark" />
  );

  return <>{(isF !== undefined && props.children) || loadingSpinner}</>;
}
