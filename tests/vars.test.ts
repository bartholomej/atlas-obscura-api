import { urlPlaceId, urlSearch } from './../src/vars';

describe('Vars id url', () => {
  test('Assemble id url', () => {
    const url = urlPlaceId(4012);
    expect(url).toBe('https://www.atlasobscura.com/places/4012.json?place_only=1');
  });
});

describe('Vars Url Search with page', () => {
  test('Assemble urlSearch with page', () => {
    const url = urlSearch({ lat: 50.08, lng: 14.42 });
    expect(url).toBe(
      'https://www.atlasobscura.com/search?utf8=%E2%9C%93&q=&location=&nearby=true&lat=50.08&lng=14.42'
    );
  });

  test('Assemble urlSearch error', () => {
    const url = urlSearch({ lat: 50.08, lng: 14.42 }, 2);
    expect(url).toBe(
      'https://www.atlasobscura.com/search?utf8=%E2%9C%93&q=&location=&nearby=true&lat=50.08&lng=14.42&page=2'
    );
  });
});
