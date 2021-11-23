import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import VolcanoContainer from "./VolcanoContainer";

export default function VolcanoLoader(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.bleDevice) {
      navigate("/");
    }
  });
  return <VolcanoContainer {...props} />;
}
