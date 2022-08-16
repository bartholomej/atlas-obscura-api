export const parseResults = <T>(matches: RegExpMatchArray): T => {
  let locations: T = null;

  if (matches && matches[1]?.length) {
    try {
      locations = JSON.parse(matches[1]);
    } catch (error) {
      console.error('Error parsing all places');
    }
  }
  return locations;
};
