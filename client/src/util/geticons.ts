// Static list of all available icons
// This represents all SVG files in the icons folder
export const availableIcons: Set<string> = new Set([
  'amazon',
  'anthropic',
  'apple',
  'canvas',
  'crunchyroll',
  'discord',
  'github',
  'google',
  'netflix',
  'openai',
  'paypal',
  'prime',
  'reddit',
  'shopify',
  'spotify',
  'steam',
  'venmo'
]);

export const isIconAvailable = (iconName: string): boolean => {
  return availableIcons.has(iconName);
};

export const iconNames: string[] = Array.from(availableIcons);

export const getIconPath = (iconName: string): string => {
  if (!isIconAvailable(iconName)) {
    console.warn(`Icon '${iconName}' not found, using default`);
    return '/default-icon.svg'; // You could create a default icon
  }
  return `/icons/${iconName}.svg`;
};

// If you need to import an icon as a React component
// Example usage: import { getIconComponent } from '../util/geticons';
// const IconComponent = getIconComponent('netflix');
export const getIconImport = (iconName: string): string => {
  if (!isIconAvailable(iconName)) {
    return ''; // Return empty string if icon not available
  }
  return `../util/icons/${iconName}.svg`;
};
