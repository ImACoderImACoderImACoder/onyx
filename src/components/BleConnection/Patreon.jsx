import { patreonLink } from "../../constants/constants";

export default function Patreon() {
  return (
    <div>
      If you want to support this project you can on{" "}
      <a href={patreonLink} target="_blank" rel="noreferrer">
        Patreon.
      </a>
    </div>
  );
}
