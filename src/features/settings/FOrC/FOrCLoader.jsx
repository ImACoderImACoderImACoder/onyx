import { useSelector } from "react-redux";
import Spinner from "react-bootstrap/Spinner";

export default function FOrCLoader(props) {
  const isF = useSelector((state) => state.settings.isF);

  const loadingSpinner = props.useSpinnerToShowLoader && (
    <Spinner animation="border" variant="dark" />
  );

  return <>{(isF !== undefined && props.children) || loadingSpinner}</>;
}
