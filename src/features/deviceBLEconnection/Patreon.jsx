import { patreonLink, cashAppLink } from "../../constants/constants";
import PrideText from "../../themes/PrideText";

export default function Patreon() {
  return (
    <div>
      <PrideText text={"If you want to support this project you can on "} />
      <a href={cashAppLink} target="_blank" rel="noreferrer">
        <PrideText text={"Cashapp"} />
      </a>
      <PrideText text={" or "} />
      <a href={patreonLink} target="_blank" rel="noreferrer">
        <PrideText text={"Patreon"} />
      </a>
    </div>
  );
}
