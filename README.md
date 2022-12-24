[![npm version](https://badge.fury.io/js/atlas-obscura-api.svg)](https://badge.fury.io/js/atlas-obscura-api)
[![Package License](https://img.shields.io/npm/l/atlas-obscura-api.svg)](https://www.npmjs.com/atlas-obscura-api)
[![Build & Publish](https://github.com/bartholomej/atlas-obscura-api/workflows/Publish/badge.svg)](https://github.com/bartholomej/atlas-obscura-api/actions)
[![codecov](https://codecov.io/gh/bartholomej/atlas-obscura-api/branch/master/graph/badge.svg?token=YQH9UoVrGP)](https://codecov.io/gh/bartholomej/atlas-obscura-api)

# Atlas Obscura API (Scraper)

> JavaScript NPM library for scraping **Atlas Obscura ([atlasobscura.com](atlasobscura.com))** [unofficial]
>
> - Browser + Node.js (SSR)
> - JavaScript / TypeScript
> - You can use in:
>   - Firebase function
>   - AWS λ (lambda function)
>   - Chrome extension
>   - React native app
>   - ...

## Install

```bash
npm install atlas-obscura-api --save
# yarn add atlas-obscura-api
```

## Usage and examples

- [All places](#All-places)
- [Search](#Search)
- [Show place by ID (short)](#Show-place-by-ID)
- [Show place by ID (full)](#Show-place-by-ID)

### All Places

Give me all places locations

```javascript
import { atlasobscura } from 'atlas-obscura-api';

atlasobscura.placesAll().then((places) => console.log(places));
```

#### Results

```javascript
[
  { id: 46691, lat: 29.99022, lng: -95.336783 },
  { id: 46850, lat: 36.709674, lng: -92.266472 },
  { id: 46597, lat: 32.805765, lng: 35.169971 },
  { id: 43701, lat: 54.415365, lng: -1.260063 },
  { id: 46266, lat: 46.196648, lng: 8.848537 },
  { id: 46282, lat: 46.236906, lng: -60.100201 },
  { id: 46028, lat: 21.272772, lng: -157.823812 },
  { id: 46736, lat: 39.635311, lng: -76.268685 },
  { id: 45981, lat: 34.101644, lng: -118.329489 },
  { id: 45455, lat: 42.929702, lng: -75.852011 },
  { id: 46206, lat: 38.912474, lng: -77.037291 },
  { id: 46081, lat: 32.930318, lng: -110.709229 }
];
```

### Search

> Search places by coordinates

```javascript
import { atlasobscura } from 'atlas-obscura-api';

atlasobscura.search({ lat: 34.0522, lng: -118.2437 }).then((search) => console.log(search));
```

#### Results

```javascript
[
  {
    title: 'Cathedral of Our Lady of the Angels',
    subtitle:
      "Crypt mausoleum in cathedral's basement contains relics of third century Roman martyr, Saint Vibiana.",
    location: 'Los Angeles, California',
    thumbnail_url:
      'https://img.atlasobscura.com/YmNZy_5DUKw21Ppt5B4Ik8zo4qjrc9RkkgT1tnAghcE/rs:fill:200:200:1/g:ce/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy8yMTky/MDAyOTQxXzEzNDEw/OTQxMDguanBn.jpg',
    url: '/places/cathedral-our-lady-angels',
    id: 1370,
    hide_from_maps: 'false',
    coordinates: [Object],
    distance_from_query: '0.38'
  },
  {
    title: 'The Last Bookstore',
    subtitle: 'This iconic L.A. bookshop is housed in an abandoned bank—both symbolic and chic.',
    location: 'Los Angeles, California',
    thumbnail_url:
      'https://img.atlasobscura.com/6XpPQSE2YVsqTDOuvfx9ZHsYY0NfmX7oLzEUL87DL4A/rs:fill:200:200:1/g:ce/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy8xMmI0/MzBkMDJjZjc2MjBj/ODJfbGIxLmpwZw.jpg',
    url: '/places/last-bookstore',
    id: 6159,
    hide_from_maps: 'false',
    coordinates: [Object],
    distance_from_query: '0.45'
  },
  {
    title: 'Wells Fargo History Museum',
    subtitle:
      'Hidden in one of the skyscrapers on Bunker Hill, this museum features an 1895 stagecoach and peers into California’s gold-lined history.',
    location: 'Los Angeles, California',
    thumbnail_url:
      'https://img.atlasobscura.com/27GLJ0vkGogC-l1AK5CuJKxS5FrBcNrcOROTWja4FAc/rs:fill:200:200:1/g:ce/c:2483:1655:nowe:2:126/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy80Mjg4/ZWJjZC0zYmNhLTQw/MTgtYTMzOC0wMTkz/M2FjNzVmZGIxMmQ4/MmVlYTgyY2IwMTM4/NTZfSU1HXzIwMTgw/ODI5XzE0NTE0NS5q/cGc.jpg',
    url: '/places/wells-fargo-history-museum-los-angeles',
    id: 28174,
    hide_from_maps: 'false',
    coordinates: [Object],
    distance_from_query: '0.47'
  }
];
```

### Show place by ID

#### Short version (one quick request)

> Get place by id (short version)

````javascript

```javascript
import { atlasobscura } from 'atlas-obscura-api';

atlasobscura.placeShort(494).then((place) => console.log(place));
````

#### Results

```javascript
{
  id: 494,
  title: 'Bodie State Historic Park',
  subtitle: 'Standing in a state of "arrested decay," this ghost town allows for a detailed peek into Gold Rush life in an unusually harsh climate.',
  city: 'Bridgeport',
  country: 'United States',
  location: 'Bridgeport, California',
  url: 'https://www.atlasobscura.com/places/bodie-state-historical-park',
  hide_from_maps: 'false',
  physical_status: '',
  thumbnail_url: 'https://img.atlasobscura.com/DzPFF3feclAXS5apzZq6HqIgaKUSxGzIEKTfCpnfKxY/rs:fill:200:200:1/g:ce/c:815:543:nowe:0:633/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85MDY0/ZDNkODljYjdmNjI0/ZWViMzA0NjU0ZjM4/ZGI5MTYzODVkZTRh/LmpwZw.jpg',
  thumbnail_url_3x2: 'https://img.atlasobscura.com/uCGcoetx8YfBtMOBo4oe1_6wUF7CM8AOK3L04aN9cg0/rs:fill:204:136:1/g:ce/c:815:543:nowe:0:633/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85MDY0/ZDNkODljYjdmNjI0/ZWViMzA0NjU0ZjM4/ZGI5MTYzODVkZTRh/LmpwZw.jpg',
  coordinates: { lat: 38.208804, lng: -119.014163 },
  nearby_places: [],
  nearby_foods: []
}
```

#### Full version (two internal requests)

> Get place by id (FULL version)

```javascript
import { atlasobscura } from 'atlas-obscura-api';

atlasobscura.placeFull(494).then((place) => console.log(place));
```

#### Results

Same as short but with full description, tags, directions and more, ... (TBD)

## Used by

- Atlas Obscura Offline mobile app (Android, iOS)
- 🤷

## Development

### Developing and debugging library

```bash
yarn start
```

### Run demo locally

You can find and modify it in [`./demo.ts`](https://github.com/bartholomej/atlas-obscura-api/blob/master/demo.ts) file

```bash
yarn demo
```

## Development (notes for me)

### Publish Stable

```shell
yarn release:patch
# yarn release:minor
# yarn release:major
```

### Publish next channel

1. Bump version `-beta.0` in `package.json`
2. `yarn release:beta`

## Contribution

I welcome you to customize this according to your needs ;)

Pull requests for any improvements would be great!

## ⭐️ Show your support

Give a ⭐️ if this project helped you!

Or if you are brave enough consider [making a donation](https://github.com/sponsors/bartholomej) for some 🍺 or 🍵 ;)

## Privacy Policy

I DO NOT STORE ANY DATA. PERIOD.

I physically can't. I have nowhere to store it. I don't even have a server database to store it. So even if Justin Bieber asked nicely to see your data, I wouldn't have anything to show him.

That's why, with atlas obscura api, what happens on your device stays on your device till disappear.

## License

Copyright &copy; 2022 [Lukas Bartak](http://bartweb.cz)

Proudly powered by nature 🗻, wind 💨, tea 🍵 and beer 🍺 ;)

**This is unofficial, experimental, made for fun and it has nothing to do with Atlas Obscura ❤️ itself**

All contents are licensed under the [MIT license].

[mit license]: LICENSE
