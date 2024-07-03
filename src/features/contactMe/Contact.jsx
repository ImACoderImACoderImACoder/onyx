import styled from "styled-components";
import PrideText from "../../themes/PrideText";
import Button from "../shared/styledComponents/Button";
import { useState } from "react";
import ModalWrapper from "../shared/styledComponents/Modal";

const StyleContactInfo = styled.input`
  height: 30px;
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border-color: ${(props) => props.theme.borderColor};
  margin-left: 1px;
  width: 90vw;
  max-width: 600px;
  margin-bottom: 10px;
  border-style: solid;
  border-width: 1px;
`;
const StyledTextArea = styled.textarea`
  height: 25vh;
  min-height: 100px;
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border-color: ${(props) => props.theme.borderColor};
  margin-left: 1px;
  width: 90vw;
  max-width: 600px;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
`;

export default function Contact() {
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleConfirm = () => {
    handleSubmit(null, true);
    setShow(false);
  };

  const onClick = (e) => {
    if (message.trim() === "") {
      e.preventDefault();
      return;
    }
  };

  const onChange = (e) => setMessage(e.target.value);
  const onContactInfoChange = (e) => setContactInfo(e.target.value);

  const encode = (data) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  };

  const handleSubmit = (e, overrideContactInfo) => {
    if (!contactInfo.trim() && !overrideContactInfo) {
      setShow(true);
      e?.preventDefault();
      return;
    }
    if (process.env.NODE_ENV === "development") {
      e?.preventDefault();
      alert(
        "This click doesn't do anything in development mode since it only works with Netlify"
      );
      return;
    }
    const formValues = { message, contactInfo };
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", ...formValues }),
    })
      .then(() => {
        alert("Success!");
        setMessage("");
        setContactInfo("");
      })
      .catch((error) => alert(error));

    e?.preventDefault();
  };

  return (
    <div>
      <h2>
        <PrideText text="Send Me a Message" />
      </h2>
      <p>
        It's always nice to hear from users. Maybe you have a feature request or
        even just want to say hi! If you would like a response be sure to
        include some kind of contact information in the message.
      </p>
      <form name="contact" method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="form-name" value="contact" />
        <p>
          <StyledLabel>
            Contact Info:{" (Not required)"}
            <StyleContactInfo
              value={contactInfo}
              onChange={onContactInfoChange}
              name="contactInfo"
              type="text"
              onKeyDown={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
            ></StyleContactInfo>
          </StyledLabel>
          <StyledLabel>
            Message:{" (Required)"}
            <StyledTextArea
              value={message}
              onChange={onChange}
              name="message"
            ></StyledTextArea>
          </StyledLabel>
        </p>
        <p>
          <Button onClick={onClick} type="submit">
            Send
          </Button>
          <ModalWrapper
            headerText={<PrideText text={`Submit without Contact Info`} />}
            bodyText='You did not provided any contact info for me to respond to you. Click "Close" to provide contact info or click "Submit" to continue without providing contact info.  I cannot respond if you do not provide your contact info.'
            confirmButtonText="Submit"
            handleClose={handleClose}
            handleConfirm={handleConfirm}
            show={show}
            tex
          />
        </p>
      </form>
    </div>
  );
}
