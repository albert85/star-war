
export interface StarWarFilmInterface {
  characters: Array<String>,
  created: string,
  director: string,
  edited: string,
  episode_id: number,
  planets: Array<string>,
  opening_crawl: string,
  producer: string,
  release_date: string,
  species: Array<string>,
  starships: Array<string>,
  vehicles: Array<string>,
  url: string,
  title: string,
}


export interface StarWarCharacterInterface {
  name: string,
  height: string,
  gender: string,
  }
