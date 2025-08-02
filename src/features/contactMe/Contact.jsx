import styled from "styled-components";
import PrideText from "../../themes/PrideText";
import Button from "../shared/styledComponents/Button";
import { useState } from "react";
import ModalWrapper from "../shared/styledComponents/Modal";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        alert(t("contact.successMessage"));
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
          <PrideText text={t("contact.title")} />
        </h2>
      </ContactFormHeader>
      
      <ContactFormDescription>
        {t("contact.description")}
      </ContactFormDescription>
      
      <form name="contact" method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="form-name" value="contact" />
        
        <FormField>
          <StyledLabel>
            {t("contact.contactInfoLabel")} <OptionalText>{t("contact.optional")}</OptionalText>
          </StyledLabel>
          <StyleContactInfo
            value={contactInfo}
            onChange={onContactInfoChange}
            name="contactInfo"
            type="text"
            placeholder={t("contact.contactInfoPlaceholder")}
            onKeyDown={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
          />
        </FormField>
        
        <FormField>
          <StyledLabel>
            {t("contact.messageLabel")} <RequiredText>{t("contact.required")}</RequiredText>
          </StyledLabel>
          <StyledTextArea
            value={message}
            onChange={onChange}
            name="message"
            placeholder={t("contact.messagePlaceholder")}
          />
        </FormField>
        
        <SubmitButtonContainer>
          <Button onClick={onClick} type="submit">
            {t("contact.sendButton")}
          </Button>
        </SubmitButtonContainer>
        
        <SpamNotice>
          <div className="icon">📬</div>
          <div className="content">
            <strong>{t("contact.important")}</strong> {t("contact.spamNotice")}
          </div>
        </SpamNotice>
        
        <ModalWrapper
          headerText={<PrideText text={t("contact.submitWithoutContactTitle")} />}
          bodyText={t("contact.submitWithoutContactBody")}
          confirmButtonText={t("contact.submitButton")}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          show={show}
        />
      </form>
    </ContactFormContainer>
  );
}
