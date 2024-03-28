export const safeParseJson = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

export function pad(d: number) {
  return d < 10 ? "0" + d.toString() : d.toString();
}
