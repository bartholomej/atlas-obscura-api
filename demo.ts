import { atlasobscura } from './src';

// Parse Atlas Obscura
atlasobscura
  .placeById(494)
  .then((place) => {
    console.log(place);
  })
  .catch((error) => {
    console.error(error);
  });

// atlasobscura.search({ lat: 34.0522, lng: -118.2437 }).then((item) => console.log(item));
// atlasobscura.placesAll().then((item) => console.log(item));
