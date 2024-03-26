export const safeParseJson = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};
