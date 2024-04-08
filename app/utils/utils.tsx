export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

export function getClassNameBasedOnDarkMode(
  isDarkMode: boolean,
  className: string
) {
  return `${className}${isDarkMode ? " dark" : ""}`;
}
