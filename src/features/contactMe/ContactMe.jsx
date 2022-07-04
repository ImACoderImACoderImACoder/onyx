import Contact from "./Contact";
import Div from "../shared/styledComponents/RootNonAppOutletDiv";
import Socials from "./Meta/Socials";
import PrideText from "../../themes/PrideText";
export default function ContactMe() {
  return (
    <Div>
      <h1>
        <PrideText text="Contact Me" />
      </h1>
      <Socials />
      <br />
      <Contact />
    </Div>
  );
}
