import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import GetTheme from '../ThemeProvider';

// Hook for accessing theme properties with memoization
export const useTheme = () => {
  const currentTheme = useSelector(state => state.settings.config?.currentTheme);
  
  return useMemo(() => {
    return GetTheme(currentTheme);
  }, [currentTheme]);
};

// Hook for toggle button theme properties
export const useToggleTheme = () => {
  const theme = useTheme();
  
  return useMemo(() => ({
    onColor: theme.ToggleButtons.onColor,
    offColor: theme.ToggleButtons.offColor,
    onBackgroundColor: theme.ToggleButtons.onBackgroundColor,
    offBackgroundColor: theme.ToggleButtons.offBackgroundColor,
    onBorderColor: theme.ToggleButtons.onBorderColor,
    offBorderColor: theme.ToggleButtons.offBorderColor,
    sliderBackgroundColorOn: theme.ToggleButtons.sliderBackgroundColorOn,
    sliderBackgroundColorOff: theme.ToggleButtons.sliderBackgroundColorOff,
    sliderBorderColorOn: theme.ToggleButtons.sliderBorderColorOn,
    sliderBorderColorOff: theme.ToggleButtons.sliderBorderColorOff,
  }), [theme]);
};

// Hook for button theme properties
export const useButtonTheme = () => {
  const theme = useTheme();
  
  return useMemo(() => ({
    buttonColorMain: theme.buttonColorMain,
    activeColor: theme.buttonActive.color,
    activeBackgroundColor: theme.buttonActive.backgroundColor,
    activeBorderColor: theme.buttonActive.borderColor,
  }), [theme]);
};

// Hook for temperature range theme properties
export const useTemperatureRangeTheme = () => {
  const theme = useTheme();
  
  return useMemo(() => ({
    lowTemperatureColor: theme.temperatureRange.lowTemperatureColor,
    highTemperatureColor: theme.temperatureRange.highTemperatureColor,
    background: theme.temperatureRange.background,
    rangeBoxColor: theme.temperatureRange.rangeBoxColor,
    rangeBoxBorderColor: theme.temperatureRange.rangeBoxBorderColor,
    rangeBackground: theme.temperatureRange.rangeBackground,
    rangeBoxBorderRadius: theme.temperatureRange.rangeBoxBorderRadius,
    rangeBoxBorderWidth: theme.temperatureRange.rangeBoxBorderWidth,
  }), [theme]);
};

// Hook for workflow editor theme properties
export const useWorkflowEditorTheme = () => {
  const theme = useTheme();
  
  return useMemo(() => ({
    accordionExpandedColor: theme.workflowEditor.accordionExpandedColor,
  }), [theme]);
};