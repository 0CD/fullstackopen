export const addSpacesBeforeCapitalLetters = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
};
