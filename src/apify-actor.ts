import { Actor } from 'apify';
import { atlasObscura } from './';

(async () => {
  await Actor.init();
  const input = await Actor.getInput();

  let result;

  switch (input.action) {
    case 'placesAll':
      result = await atlasObscura.placesAll();
      break;
    case 'search':
      if (!input.query) throw new Error('Missing query for placesSearch');
      result = await atlasObscura.search(input.query);
      break;
    case 'user':
      if (!input.userId) throw new Error('Missing userId for user');
      result = await atlasObscura.user(input.userId);
      break;
    case 'placeFull':
      if (!input.placeId) throw new Error('Missing placeId for placeFull');
      result = await atlasObscura.placeFull(input.placeId);
      break;
    case 'placeShort':
      if (!input.placeId) throw new Error('Missing placeId for placeShort');
      result = await atlasObscura.placeShort(input.placeId);
      break;
    default:
      throw new Error(`Unknown action: ${input.action}`);
  }

  await Actor.pushData(result);
  await Actor.exit();
})();
