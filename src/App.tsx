/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import StarWarBg from './assets/starwarz.png'

import './App.css';
import { useQuery } from 'react-query';
import movieAPI from './api/fetchMovie';
import { StarWarFilmInterface, StarWarCharacterInterface } from './Appinterface';

function App() {
  const [sortType, setSortType] = React.useState(true);
  const [selectAGender, setSelectAGender] = React.useState('0');
  const [selectMovie, setSelectMovie] = React.useState<StarWarFilmInterface>();
  const [selectCharacter, setSelectCharacter] = React.useState<StarWarCharacterInterface[]>([]);
  const { data } = useQuery('movie', movieAPI.fetchMovie)

  const onSelected = (e: any) => {
    if(Number(e.target.value) !== 0) {
      const [filtered] = data?.results?.filter((eachFilm: StarWarFilmInterface) => eachFilm.episode_id === Number(e.target.value))
      filtered?.characters?.map(async (eachCharacter: string) => {
        const response = await movieAPI.fetchCharacter({ url: `http://anyorigin.com/go?${eachCharacter}` });
        setSelectCharacter((prev): StarWarCharacterInterface[] => [ ...prev, {...response, height: Number(response.height), gender: selectGender(response?.gender)}])
      })
      return setSelectMovie(filtered);
    }
    return setSelectMovie(undefined);
  }

  const selectGender = (type: string) => {
    switch(type){
      case 'male':
        return 'M';
      case 'female':
        return 'F';
      default:
        return 'N/A'
    }
  }

  const compareValues = (key: React.Key, order = 'asc') => {
    return function innerSort(a: { [x: string]: any; hasOwnProperty: (arg0: any) => any; }, b: { [x: string]: any; hasOwnProperty: (arg0: any) => any; }) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  const filterCharacter = (filterVariable: string) => {
    selectCharacter.sort(compareValues(filterVariable, sortType ? 'asc' : 'desc'));
    if(selectAGender !== '0'){
      const filtered = selectCharacter.filter((eachCharacter: StarWarCharacterInterface) => eachCharacter?.gender === selectAGender)
      setSelectCharacter(filtered);
    }
    setSortType((prev) => !prev);
    setSelectCharacter(selectCharacter);
  }

  const onGenderSelect = (e: any) => {
    setSelectAGender(e.target.value);
  }

  React.useEffect(()=> {
    const filtered = selectCharacter.filter((eachCharacter: StarWarCharacterInterface) => eachCharacter?.gender === selectAGender)
    setSelectCharacter(filtered);
  }, [selectAGender])

  return (
    <div className="App">
      {data && (<select defaultValue={0} className="drop-down" onChange={onSelected}>
        {[{episode_id: 0, title: '---- Please Select A Movie ----'}, ...data?.results]?.map((eachOption: StarWarFilmInterface) => {
          return (
            <option key={eachOption?.episode_id} value={eachOption?.episode_id}>{eachOption?.title}</option>
          )
        })}
      </select>)}
      {!selectMovie && (<img src={StarWarBg} alt="start-war" />)}

      {selectMovie && (<div className="box">
        <p className="story-line">{selectMovie?.opening_crawl}</p>
      </div>)}
      {selectMovie && (<select defaultValue={selectAGender} className="drop-down" onChange={onGenderSelect}>
          <option key={0} value="0">--- Please Select a gender ---</option>
          <option key={1} value="M">M</option>
          <option key={2} value="F">F</option>
          <option key={3} value="N/A">N/A</option>
      </select>)}
   {selectMovie && (<table>
        <thead>
          <tr>
            <th onClick={() => filterCharacter('name')}>Name</th>
            <th onClick={() => filterCharacter('gender')}>Gender</th>
            <th onClick={() => filterCharacter('height')}>Height</th>
          </tr>
        </thead>
        <tbody>
          {selectCharacter?.map((eachCharacter) => (<tr key={eachCharacter?.name}>
            <td>{eachCharacter?.name}</td>
            <td>{eachCharacter?.gender}</td>
            <td>{eachCharacter?.height}</td>
          </tr>))}
        </tbody>
      </table>)}
    </div>
  );
}

export default App;
