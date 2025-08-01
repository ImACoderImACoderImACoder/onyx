// Required theme properties for validation
const REQUIRED_THEME_PROPS = [
  'author',
  'themeId',
  'borderStyle',
  'buttonColorMain',
  'backgroundColor', 
  'primaryFontColor',
  'borderColor',
  'currentTemperatureColor',
  'targetTemperatureColor',
  'iconColor',
  'iconTextColor',
  'buttonActive.color',
  'buttonActive.backgroundColor',
  'buttonActive.borderColor',
  'plusMinusButtons.backgroundColor',
  'plusMinusButtons.color',
  'plusMinusButtons.borderColor',
  'temperatureRange.lowTemperatureColor',
  'temperatureRange.highTemperatureColor',
  'temperatureRange.background',
  'temperatureRange.rangeBoxColor',
  'temperatureRange.rangeBoxBorderColor',
  'temperatureRange.rangeBoxBorderRadius',
  'temperatureRange.rangeBoxBorderWidth',
  'workflowEditor.accordionExpandedColor',
  'ToggleButtons.sliderBackgroundColorOn',
  'ToggleButtons.sliderBorderColorOn',
  'ToggleButtons.sliderBorderColorOff',
  'ToggleButtons.onColor',
  'ToggleButtons.offColor',
  'ToggleButtons.onBackgroundColor',
  'ToggleButtons.offBackgroundColor',
  'ToggleButtons.onBorderColor',
  'ToggleButtons.offBorderColor'
];

// Get nested property value
const get = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Convert hex color to RGB
const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Calculate relative luminance for WCAG contrast
const getRelativeLuminance = (rgb) => {
  if (!rgb) return 0;
  const { r, g, b } = rgb;
  
  const getRsRGB = (val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  
  return 0.2126 * getRsRGB(r) + 0.7152 * getRsRGB(g) + 0.0722 * getRsRGB(b);
};

// Calculate WCAG contrast ratio
const getContrastRatio = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (lightest + 0.05) / (darkest + 0.05);
};

// WCAG AA requires 4.5:1 for normal text, 3:1 for large text
// WCAG AAA requires 7:1 for normal text, 4.5:1 for large text
const checkContrastCompliance = (ratio, isLargeText = false) => {
  const aaThreshold = isLargeText ? 3.0 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7.0;
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= aaThreshold,
    aaa: ratio >= aaaThreshold,
    level: ratio >= aaaThreshold ? 'AAA' : ratio >= aaThreshold ? 'AA' : 'Fail'
  };
};

// Check if nested property exists
const has = (obj, path) => {
  return get(obj, path) !== undefined;
};

export const validateTheme = (theme) => {
  if (!theme) {
    console.error('Theme validation failed: theme is null or undefined');
    return false;
  }

  if (!theme.themeId) {
    console.warn('Theme validation warning: missing themeId');
  }

  const missing = REQUIRED_THEME_PROPS.filter(prop => !has(theme, prop));
  
  if (missing.length > 0) {
    console.warn(`Theme ${theme.themeId || 'unknown'} missing required properties:`, missing);
    return false;
  }

  // Check for common issues and accessibility
  const warnings = [];
  const accessibilityIssues = [];
  
  if (theme.backgroundColor === theme.primaryFontColor) {
    warnings.push('backgroundColor and primaryFontColor are the same - text may not be visible');
  }
  
  if (theme.buttonActive.backgroundColor === theme.buttonActive.color) {
    warnings.push('buttonActive backgroundColor and color are the same - button text may not be visible');
  }

  // WCAG Contrast Validation
  const contrastChecks = [
    {
      name: 'Main text',
      bg: theme.backgroundColor,
      fg: theme.primaryFontColor,
      isLarge: false
    },
    {
      name: 'Button text',
      bg: theme.buttonColorMain,
      fg: theme.primaryFontColor,
      isLarge: false
    },
    {
      name: 'Active button',
      bg: get(theme, 'buttonActive.backgroundColor'),
      fg: get(theme, 'buttonActive.color'),
      isLarge: false
    },
    {
      name: 'Toggle button (on)',
      bg: get(theme, 'ToggleButtons.onBackgroundColor'),
      fg: get(theme, 'ToggleButtons.onColor'),
      isLarge: false
    },
    {
      name: 'Toggle button (off)',
      bg: get(theme, 'ToggleButtons.offBackgroundColor'),
      fg: get(theme, 'ToggleButtons.offColor'),
      isLarge: false
    }
  ];

  contrastChecks.forEach(check => {
    if (check.bg && check.fg) {
      const ratio = getContrastRatio(check.bg, check.fg);
      const compliance = checkContrastCompliance(ratio, check.isLarge);
      
      if (!compliance.aa) {
        accessibilityIssues.push(
          `${check.name}: ${compliance.ratio}:1 (${compliance.level}) - fails WCAG AA standard`
        );
      }
    }
  });

  if (warnings.length > 0) {
    console.warn(`Theme ${theme.themeId || 'unknown'} potential issues:`, warnings);
  }

  if (accessibilityIssues.length > 0) {
    console.warn(`Theme ${theme.themeId || 'unknown'} accessibility issues:`, accessibilityIssues);
  }

  return true;
};

export const validateAllThemes = (themes) => {
  const results = {};
  
  for (const [themeId, theme] of Object.entries(themes)) {
    results[themeId] = validateTheme(theme);
  }
  
  return results;
};

// Development helper to log theme structure
export const logThemeStructure = (theme) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Theme Structure: ${theme.themeId || 'unknown'}`);
    console.log('Author:', theme.author);
    console.log('Theme Properties:', Object.keys(theme).sort());
    console.log('Full Theme:', theme);
    console.groupEnd();
  }
};