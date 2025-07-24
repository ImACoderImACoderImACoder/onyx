import styled from "styled-components";
import PrideText from "../../themes/PrideText";
import Button from "../shared/styledComponents/Button";
import { useState } from "react";
import ModalWrapper from "../shared/styledComponents/Modal";

const ContactFormContainer = styled.div`
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
`;

const ContactFormHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
  
  h2 {
    margin-bottom: 16px;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const ContactFormDescription = styled.p`
  color: ${props => props.theme.primaryFontColor};
  opacity: 0.8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const StyledLabel = styled.label`
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${props => props.theme.primaryFontColor};
  margin-bottom: 8px;
`;

const StyleContactInfo = styled.input`
  width: 100%;
  height: 48px;
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border: 2px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${(props) => props.theme.primaryColor || props.theme.borderColor};
  }
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.buttonActive.borderColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.buttonActive.borderColor}33;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  height: 25vh;
  max-height: 300px;
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border: 2px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${(props) => props.theme.primaryColor || props.theme.borderColor};
  }
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.buttonActive.borderColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.buttonActive.borderColor}33;
  }
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const RequiredText = styled.span`
  color: ${props => props.theme.primaryColor || '#ff6600'};
  font-weight: 500;
`;

const OptionalText = styled.span`
  color: ${props => props.theme.primaryFontColor};
  opacity: 0.6;
  font-weight: 400;
`;

const SpamNotice = styled.div`
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  
  .icon {
    font-size: 1.2rem;
    color: ${props => props.theme.primaryColor || '#ff6600'};
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .content {
    font-size: 0.9rem;
    line-height: 1.4;
    color: ${props => props.theme.primaryFontColor};
    opacity: 0.85;
  }
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
    <ContactFormContainer>
      <ContactFormHeader>
        <h2>
          <PrideText text="💬 Send Me a Message" />
        </h2>
      </ContactFormHeader>
      
      <ContactFormDescription>
        It's always nice to hear from users! Whether you have a feature request, 
        feedback, or just want to say hi, I read every message. Include your contact 
        information if you'd like a response - I reply to every message that includes it.
      </ContactFormDescription>
      
      <form name="contact" method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="form-name" value="contact" />
        
        <FormField>
          <StyledLabel>
            Contact Info <OptionalText>(Optional)</OptionalText>
          </StyledLabel>
          <StyleContactInfo
            value={contactInfo}
            onChange={onContactInfoChange}
            name="contactInfo"
            type="text"
            placeholder="Your email, Discord, etc."
            onKeyDown={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
          />
        </FormField>
        
        <FormField>
          <StyledLabel>
            Message <RequiredText>(Required)</RequiredText>
          </StyledLabel>
          <StyledTextArea
            value={message}
            onChange={onChange}
            name="message"
            placeholder="Your message here..."
          />
        </FormField>
        
        <SubmitButtonContainer>
          <Button onClick={onClick} type="submit">
            📤 Send Message
          </Button>
        </SubmitButtonContainer>
        
        <SpamNotice>
          <div className="icon">📬</div>
          <div className="content">
            <strong>Important:</strong> If you provided contact info and don't hear back within a few days, please check your spam/junk folder as my replies sometimes end up there.
          </div>
        </SpamNotice>
        
        <ModalWrapper
          headerText={<PrideText text={`Submit without Contact Info`} />}
          bodyText='You did not provide any contact info for me to respond to you. Click "Close" to provide contact info or click "Submit" to continue without providing contact info. I cannot respond if you do not provide your contact info.'
          confirmButtonText="Submit"
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          show={show}
        />
      </form>
    </ContactFormContainer>
  );
}
