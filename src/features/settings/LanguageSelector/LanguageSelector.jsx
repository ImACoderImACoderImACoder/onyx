import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../settingsSlice";
import SettingsItem from "../SettingsItem";
import Select from "react-bootstrap/FormSelect";
import styled from "styled-components";
import { useEffect } from "react";
import { SUPPORTED_LANGUAGES } from "../../../services/utils";

const StyledSelect = styled(Select)`
  max-width: 250px;
  color: ${(props) => props.theme.primaryFontColor};
  background-color: ${(props) => props.theme.backgroundColor};
  border-color: ${(props) => props.theme.borderColor};
`;

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const storedLanguage = useSelector((state) => state.settings.language);
  const config = useSelector((state) => state.settings.config);

  // Initialize language from stored config on mount
  useEffect(() => {
    if (config?.language && config.language !== storedLanguage) {
      dispatch(setLanguage(config.language));
      if (config.language !== 'default') {
        i18n.changeLanguage(config.language);
      }
    }
  }, [config?.language, storedLanguage, dispatch, i18n]);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
    
    if (selectedLanguage === 'default') {
      // Use browser language detection
      const browserLanguage = navigator.language.split('-')[0];
      const languageToUse = SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : 'en';
      i18n.changeLanguage(languageToUse);
    } else {
      i18n.changeLanguage(selectedLanguage);
    }
  };

  const getCurrentValue = () => {
    return storedLanguage || 'default';
  };

  return (
    <SettingsItem
      title={t('settings.language.title')}
      description={t('settings.language.description')}
    >
      <StyledSelect 
        value={getCurrentValue()} 
        onChange={handleLanguageChange}
      >
        <option value="default">{t('settings.language.default')}</option>
        <option value="en">{t('settings.language.english')}</option>
        <option value="fr">{t('settings.language.french')}</option>
        <option value="es">{t('settings.language.spanish')}</option>
      </StyledSelect>
    </SettingsItem>
  );
}