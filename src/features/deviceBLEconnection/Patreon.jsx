import { patreonLink } from "../../constants/constants";
import PrideText from "../../themes/PrideText";

export default function Patreon() {
  return (
    <div>
      <PrideText text={"If you want to support this project you can on "} />
      <a href={patreonLink} target="_blank" rel="noreferrer">
        <PrideText text={"Patreon."} />
      </a>
    </div>
  );
}
