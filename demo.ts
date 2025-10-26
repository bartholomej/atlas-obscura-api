import { atlasObscura } from './src';

// Parse Atlas Obscura
atlasObscura
  .placeFull(46288)
  .then((place) => {
    console.log(place);
  })
  .catch((error) => {
    console.error(error);
  });

// atlasObscura.search({ lat: 34.0522, lng: -118.2437 }).then((item) => console.log(item));
// atlasObscura.placesAll().then((item) => console.log(item));
