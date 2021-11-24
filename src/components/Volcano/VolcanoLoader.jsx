import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import VolcanoContainer from "./VolcanoContainer";

export default function VolcanoLoader(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.bleDevice) {
      navigate("/");
    }
  }, [props.bleDevice, navigate]);

  return props.bleDevice ? (
    <VolcanoContainer {...props} />
  ) : (
    <div>Loading...</div>
  );
}
