import { useDispatch, useSelector } from "react-redux";
import { setCurrentTheme } from "../settingsSlice";
import * as themeIds from "../../../constants/themeIds";
import Themes from "./Themes";
import GetTheme from "../../../themes/ThemeProvider";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";

export default function ThemesContainer() {
  const config = useSelector((state) => state.settings.config);
  const currentTheme = config?.currentTheme || GetTheme().themeId;

  const dispatch = useDispatch();
  const themeKeys = Object.keys(themeIds);
  const options = themeKeys.map((key) => {
    return (
      <option key={key} value={themeIds[key]}>
        {themeIds[key]}
      </option>
    );
  });

  const onChange = (e) => {
    WriteNewConfigToLocalStorage({
      ...config,
      currentTheme: e.target.value,
    });
    dispatch(setCurrentTheme(e.target.value));
  };

  return (
    <Themes currentTheme={currentTheme} onChange={onChange} options={options} />
  );
}
