[![npm version](https://badge.fury.io/js/atlas-obscura-api.svg)](https://badge.fury.io/js/atlas-obscura-api)
[![Package License](https://img.shields.io/npm/l/atlas-obscura-api.svg)](https://www.npmjs.com/atlas-obscura-api)
[![Build & Publish](https://github.com/bartholomej/atlas-obscura-api/workflows/Publish/badge.svg)](https://github.com/bartholomej/atlas-obscura-api/actions)
[![codecov](https://codecov.io/gh/bartholomej/atlas-obscura-api/branch/master/graph/badge.svg?token=YQH9UoVrGP)](https://codecov.io/gh/bartholomej/atlas-obscura-api)

# Atlas Obscura API (Scraper)

> JavaScript NPM library for scraping **Atlas Obscura ([atlasobscura.com](https://atlasobscura.com))** [unofficial]
>
> - Browser + Node.js
> - JavaScript / TypeScript
> - ESM + CJS support
> - You can use in:
>   - Serverless functions
>   - Firebase function
>   - AWS λ (lambda function)
>   - Chrome extension
>   - React native app
>   - Docker container
>   - Node.js app
>   - ...

## 📦 Installation

Install the library using npm, yarn, or your preferred package manager:

```bash
npm install atlas-obscura-api --save
```

## 🚀 Usage and Examples

Explore how to use the library with practical code snippets and sample outputs below:

- [All places](#all-places)
- [Search](#search)
- [Show place by ID (short)](#short-version-one-quick-request)
- [Show place by ID (full)](#full-detail-two-internal-requests)
- [User](#user)

### All Places

> Retrieve all places locations

```javascript
import { atlasObscura } from 'atlas-obscura-api';

atlasObscura.placesAll().then((places) => console.log(places));
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
import { atlasObscura } from 'atlas-obscura-api';

atlasObscura.search({ lat: 34.0522, lng: -118.2437 }).then((search) => console.log(search));
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
    hide_from_maps: false,
    coordinates: { lat: 34.05765, lng: -118.244944 },
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
    hide_from_maps: false,
    coordinates: { lat: 34.047738, lng: -118.249422 },
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
    hide_from_maps: false,
    coordinates: { lat: 34.05283, lng: -118.25191 },
    distance_from_query: '0.47'
  }
];
```

### Show Place by ID

#### Short Version (One Quick Request)

> Get place by id (short version)

```javascript
import { atlasObscura } from 'atlas-obscura-api';

atlasObscura.placeShort(494).then((place) => console.log(place));
```

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
  hide_from_maps: false,
  physical_status: '',
  thumbnail_url: 'https://img.atlasobscura.com/DzPFF3feclAXS5apzZq6HqIgaKUSxGzIEKTfCpnfKxY/rs:fill:200:200:1/g:ce/c:815:543:nowe:0:633/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85MDY0/ZDNkODljYjdmNjI0/ZWViMzA0NjU0ZjM4/ZGI5MTYzODVkZTRh/LmpwZw.jpg',
  thumbnail_url_3x2: 'https://img.atlasobscura.com/uCGcoetx8YfBtMOBo4oe1_6wUF7CM8AOK3L04aN9cg0/rs:fill:204:136:1/g:ce/c:815:543:nowe:0:633/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85MDY0/ZDNkODljYjdmNjI0/ZWViMzA0NjU0ZjM4/ZGI5MTYzODVkZTRh/LmpwZw.jpg',
  coordinates: { lat: 38.208804, lng: -119.014163 },
  nearby_places: [],
  nearby_foods: []
}
```

#### Full Detail (Two Internal Requests)

> Get place by ID (FULL version).
>
> Beware: it makes two requests internally

```javascript
import { atlasObscura } from 'atlas-obscura-api';

atlasObscura.placeFull(494).then((place) => console.log(place));
```

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
  hide_from_maps: false,
  physical_status: '',
  thumbnail_url: 'https://img.atlasobscura.com/KaOCwrZAjNgS3LMOK28iuTxHDnMsl3Yjy0L_bYpfF1I/rs:fill:200:200:1/g:ce/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85MDY0/ZDNkODljYjdmNjI0/ZWViMzA0NjU0ZjM4/ZGI5MTYzODVkZTRh/LmpwZw.jpg',
  thumbnail_url_3x2: 'https://img.atlasobscura.com/aH-Qf5bAn0PE1Y6gf0b1xHdteWwXY0G99dMtlMEdWVk/rs:fill:204:136:1/g:ce/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85MDY0/ZDNkODljYjdmNjI0/ZWViMzA0NjU0ZjM4/ZGI5MTYzODVkZTRh/LmpwZw.jpg',
  coordinates: { lat: 38.208804, lng: -119.014163 },
  description: [
    'It was once the most lawless town in <a class="destination-link place-destination-link" href="https://www.atlasobscura.com/things-to-do/california">California</a>, a place where the fire bell ringing out the ages of those being laid to rest seemed to never stop its toll.',
    "Today, what's left of Bodie is an eerie shell of the rough-and-tumble Gold Rush town, a window into a time long lost. Located in a very uniquely difficult climate of a &nbsp;desolate, high altitude plateau in the mountains but not in the woods, Bodie was not for the weak of heart—or feeble of constitutions.",
    'Nestled in the Bodie Hills, east of the Sierra Nevada mountains just north of <a href="https://www.atlasobscura.com/places/mono-lake">Mono Lake</a>, Bodie grew quickly from a quiet town of 500 people to a rowdy mining city. Its population exploded during the second boom of the California gold rush and the beginning of the Nevada silver rush. By 1879, Bodie boasted a population of 10,000 and had 65 saloons, 50 mining companies, a thriving red-light district in the north end of town, and the worst reputation in the state.',
    `Despite its nasty reputation, gold- and silver-seekers came from every corner of the country to this environment to "see the elephant," as heading West was called. Bodie's promise of gold and silver fortunes even attracted the likes of railroad tycoon Leland Stanford. With fortune hunters pouring in from all over the world, opium dens, brothels and gambling dens popped up for every flavor of wild west entertainment. They came for the gold and stayed for the party.`,
    'Perhaps predictably, the mines quickly reached full capacity, and soon the mining companies cut their losses and closed down. Just as fast as Bodie had boomed, it busted, and the population had plummeted below 100 by 1888. Devoted locals held on until the 1920s, when Standard Mining closed down, but despite popular belief, Bodie was never completely abandoned. A few stragglers held down the fort until Bodie was absorbed as a National Landmark in 1962.',
    'Today the windswept streets of Bodie are open to the public. It is the best-preserved ghost town in California, with about 200 structures remaining (about 5% of its original glory), along with rusted-out cars and machinery and boarded-up mines. Many of the building interiors still contain original artifacts and cannot be entered. The state is now restoring many of the buildings, as well as building more tourist-friendly walkways and restroom facilities.',
    'Generally closed during the winter, the most reasonable access to Bodie is dusty highway 270, from highway 395. Call ahead during the swing months between winter and summer to check accessibility. Sometimes, a gate 1.5 miles out keeps away vehicles and advises hikers that the road is not fit to drive on.'
  ],
  directions: [
    'The Bodie Foundation runs a number of events every year. These include Friends of Bodie Day, which includes many historical reenactments; ghost walks; and photo workshops. The Stamp Mill, the only remaining industrial structure, is accessible only by guided tours. These tours can book up quickly. See Bodie Foundation link below for all listings. The park is northeast of Yosemite, 13 miles east of Highway 395 on Bodie Road (Hwy 270), seven miles south of Bridgeport.',
    'Before you set out to visit Bodie, there are a few things you should consider. Because of its altitude Bodie is very cold. Temperatures drop below freezing point 300 days a year. Dress accordingly.',
    'There is no gas station and no food for sale. So fill up your tank and pack a lunch.',
    'If you love photography, bring all your gear with you.'
  ],
  tags: [
    { title: 'Abandoned', link: '/categories/abandoned' },
    { title: 'Mining', link: '/categories/mining' },
    { title: 'Ghost Towns', link: '/categories/ghost-towns' },
    { title: 'Gold Rush', link: '/categories/gold-rush' },
    { title: 'Ruins', link: '/categories/ruins' }
  ],
  imageCover: 'https://img.atlasobscura.com/Z7fkZefihgyRxzYQkbuv_xrdta4jxvASv_qBAfW_nYU/rt:fit/h:400/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85MDY0/ZDNkODljYjdmNjI0/ZWViMzA0NjU0ZjM4/ZGI5MTYzODVkZTRh/LmpwZw.jpg',
  images: [
    'https://img.atlasobscura.com/Z7fkZefihgyRxzYQkbuv_xrdta4jxvASv_qBAfW_nYU/rt:fit/h:400/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85MDY0/ZDNkODljYjdmNjI0/ZWViMzA0NjU0ZjM4/ZGI5MTYzODVkZTRh/LmpwZw.jpg',
    'https://img.atlasobscura.com/a9V41OvE1zN7VchlVSGWtBSAcxfBT6GKrh-2UNbjzRU/rt:fit/h:400/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85dHR4/cDZiajVkNThlN2Zk/ZWQzMDNiMTA0MzI1/X0lNR185NDIyLlBO/Rw.jpg'
  ]
}
```

#### User

> Get user by nickname

```javascript
import { atlasObscura } from 'atlas-obscura-api';

atlasObscura.user('bartholomej').then((user) => console.log(user));
```

#### Results

```javascript
{
  "id": 251656,
  "places": [
    {
      "id": 15078,
      "title": "Roskilde Viking Ship Museum ",
      "subtitle": "Nordic giants resurrected from the sea and restored to their former greatness.",
      "url": "https://www.atlasobscura.com/places/roskilde-viking-ship-museum",
      "location": "Roskilde, Denmark",
      "thumbnail_url": "https://img.atlasobscura.com/DjHjzdzd3l7b8AN47HKwpt8GYmG83Yo2pVJdmr2bhWY/rs:fill:200:200:1/g:ce/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy8xODRm/NTFjYjAzMzM3OTFh/ZTBfSU1HXzAyODcu/SlBH.jpg",
      "coordinates": {
        "lat": 55.649645,
        "lng": 12.077977
      }
    },
    {
      "id": 58990,
      "title": "Grave of the Hel-Horse",
      "subtitle": "According to legend, this is the burial place of a mythical three-legged death omen horse.",
      "url": "https://www.atlasobscura.com/places/grave-of-the-hel-horse-roskilde",
      "location": "Roskilde, Denmark",
      "thumbnail_url": "https://img.atlasobscura.com/5jjvXXDD7Mravpa0EZiIluytCKiQYjfl_EtPakLaK-Q/rs:fill:200:200:1/g:ce/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy9jYjk1/MjBjMy01NjNlLTRj/ZjItOTY4Yi1iNmY5/MGY5ZWFkZjZiY2Zi/NmE2NTgwYWQ5NGFl/ZTJfMjAyNDA1MThf/MTIwMDIyLmpwZw.jpg",
      "coordinates": {
        "lat": 55.642489,
        "lng": 12.079727
      }
    },
    {
      "id": 51651,
      "title": "Kamo River Turtle Stepping Stones ",
      "subtitle": "These turtle-shaped concrete stepping stones provide a unique river crossing in central Kyoto. ",
      "url": "https://www.atlasobscura.com/places/kamogawa-river-turtle-stepping-stones",
      "location": "Kyoto, Japan",
      "thumbnail_url": "https://img.atlasobscura.com/XmjRSPUfP2jQwVQrLFRckpb_UPUTCuDWJ8zqZJt9Wfc/rs:fill:200:200:1/g:ce/c:2997:1998:nowe:4:1914/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85ZDEz/M2FiMi0xMWFkLTQ5/ODgtYThiYy1hYmI3/N2E0NTBhNzc3MDNl/M2FjMjcyOTJmMjQ3/MTlfN0MxRUJFMUYt/REU1Ni00M0VBLTg0/ODctN0U4MEZGMDVD/RDNDLmpwZWc.jpg",
      "coordinates": {
        "lat": 35.029859,
        "lng": 135.771764
      }
    }
  ]
}
```

## 📦 Docker

You can use this library in Docker.

We have [prepared a Docker image](https://hub.docker.com/r/bartholomej/atlas-obscura-api) for you.

### Prebuilt image

```bash
docker pull bartholomej/atlas-obscura-api
```

### Build & run your own image

> Build image

```bash
docker build -t atlas-obscura-api .
```

> Run image on port 3000

```bash
docker run -p 3000:3000 atlas-obscura-api
```

> Open http://localhost:3000

### API endpoints

> Some examples

- `/places-all`
- `/search/prague`
- `/place-short/465`
- `/place-full/456`
- `/user/bartholomej`

## Used By

- Mobile app: Atlas Obscura: Offline → [Play Store](https://play.google.com/store/apps/details?id=com.aquasoup.atlasobscura)
- Chrome extension: Atlas Obscura Tabs → [Chrome Web Store](https://chromewebstore.google.com/detail/atlas-obscura-tabs-unoffi/jdbhojildmiebfbfepepcampalojdpdc)

## Development

### Developing and Debugging Library

Start the development server:

```bash
yarn start
```

### Run Demo Locally

You can find and modify it in [`./demo.ts`](https://github.com/bartholomej/atlas-obscura-api/blob/master/demo.ts) file:

```bash
yarn demo
```

## 📝 Development Notes

### Publish Stable

```bash
yarn release:patch
# yarn release:minor
# yarn release:major
```

### Publish Next Channel

1. Bump version `-beta.0` in `package.json`
2. Run:

```bash
yarn release:beta
```

## Contribution

Contributions are welcome! Feel free to customize this library according to your needs.

Pull requests for any improvements are greatly appreciated!

## ⭐️ Show Your Support

If this project helped you, consider giving it a ⭐️!

Give a ⭐️ if this project helped you!

Or if you are brave enough consider [making a donation](https://github.com/sponsors/bartholomej) for some 🍺 or 🍵 ;)

## 🛡️ Privacy Policy

I DO NOT STORE ANY DATA. PERIOD.

I physically can't. I have nowhere to store it. I don't even have a server database to store it. So even if Justin Bieber asked nicely to see your data, I wouldn't have anything to show him.

That's why, with atlas obscura api, what happens on your device stays on your device till disappear.

## 📝 License

Copyright &copy; 2025 [Lukas Bartak](http://bartweb.cz)

Proudly powered by nature 🗻, wind 💨, tea 🍵 and beer 🍺 ;)

**This is unofficial, experimental, made for fun, and has nothing to do with Atlas Obscura ❤️ itself.**

All contents are licensed under the [MIT license].

[MIT license]: LICENSE
