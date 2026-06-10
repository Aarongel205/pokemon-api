import { useEffect, useState } from 'react'
import pokemonTitle from './assets/pokemon.webp'
import runningPikachu from './assets/runningPikachu.gif'
import pokemonDay  from './assets/pokemonBgImage.png'
import pokemonNight from './assets/pokemonNightBg.webp'

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const hours = new Date().getHours();

  const isDay = hours >= 6 && hours < 18;

  const nightStyle = {
    cardStyle: {
      backgroundColor: '#023e8a',
      color: 'white',
      border: 'border 3px solid #212529'
    },
  }

  const dayStyle = {
    backgroundColor: 'white',
    color: 'black',
    border: 'border 3px solid black'
  }
  
  
  const getPokemons = async () => {
    try{
      const request = [];
    
      for(let i = 1; i <= 200; i++){
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const data = await response.json();
        request.push(data);
      }

      setPokemons(request);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }

  }

  const itemPerPage = 3;

  const lastIndex = currentPage * itemPerPage;
  const firstIndex = lastIndex - itemPerPage;

  const data = pokemons.slice(firstIndex, lastIndex);

  const next = () => {
    const totalPages = Math.ceil(pokemons.length / itemPerPage);
    if(currentPage === totalPages){
      setCurrentPage(1);
    }else{
      setCurrentPage(currentPage + 1);
    }
  }

  const prev = () => {
    const totalPages = Math.ceil(pokemons.length / itemPerPage);
    if(currentPage === 1){
      setCurrentPage(totalPages);
    }else{
      setCurrentPage(currentPage - 1);
    }
  }

  const pageButtons = () => {
    const buttons = [];

    const totalPages = Math.ceil(pokemons.length / itemPerPage);
    const maxButtons = 5;

    let startPage = currentPage - Math.floor(maxButtons / 2);
    let endPage = currentPage + Math.floor(maxButtons / 2);

    if(startPage < 1){
      startPage = 1;
      endPage = Math.min(maxButtons, totalPages);
    }
    

    if(endPage > totalPages){
      endPage = totalPages;
      startPage = Math.max(maxButtons, totalPages - maxButtons + 1);
    }

    for(let i = startPage; i <= endPage; i++){
      buttons.push(
        <button className=' bg-[#c62828] w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-white text-sm sm:text-base' style={{
          filter: currentPage === i && isDay ? 'drop-shadow(0 0 5px #c62828)' : 'drop-shadow(0 0 5px #023e8a)',
          backgroundColor: isDay ? '' : '#023e8a',
          color: isDay ? '' : 'white',
        }} onClick={() => setCurrentPage(i)} key={i}>
          {i}
        </button>
      )
    }

    return buttons;
  }

  const setBgColor = (bgColor) => {
    switch(bgColor){
      case 'grass':
        return 'green';
        break;
      case 'fire':
        return 'red';
        break;
      case 'poison':
        return '#5a189a';
        break;
      case 'bug':
        return 'lime';
        break;
      case 'electric':
        return '#ffd60a';
        break;
      case 'ground':
        return '#C2B280';
        break;
      case 'fairy':
        return '#ffb3c6';
        break;
      case 'water':
        return '#0096c7';
        break;
      case 'psychic':
        return '#6930c3';
        break;
      case 'fighter':
        return '#902923';
        break;
      case 'rock':
        return '#99582a';
        break;
      case 'ghost':
        return '#560bad';
        break;
      default:
        return 'gray';
    }
  }


  const displayPokemons = data.map((pokemon, index) => {
    return(
      <li style={isDay ? dayStyle : nightStyle.cardStyle} className='bg-[#f1faee] border-3 border-black sm:w-72 md:w-64 lg:w-72 rounded-lg overflow-hidden shadow-lg' key={index}>
        <img className='w-full h-48 sm:h-56 object-contain' style={{
          backgroundColor: setBgColor(pokemon.types[0].type.name),
        }} src={pokemon.sprites.front_default}></img>
        <p>{pokemon.name.toUpperCase()}</p>
        <p className='text-1'>{pokemon.moves[0].move.name || 'none'}</p>
        <p>TYPE/{pokemon.types[0].type.name}</p>
      </li>
    )
  })

  useEffect(() => {
    getPokemons();
  }, [])

  return (
    <section style={{
      backgroundImage: `url(${isDay ? pokemonDay : pokemonNight})`
    }} className='bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center min-h-screen px-4 py-8'>
      <img className='w-64 sm:w-80 md:w-96 mb-8' src={pokemonTitle}></img>
      {loading ? (
        <div className='flex flex-col justify-center items-center text-center'>
          <p className='text-white text-2xl'>Loading...</p>
          <img className='w-30' src={runningPikachu}></img>
        </div>
      ) : 
      (
        <ul className='flex flex-col md:flex-row max-w-6xl gap-4 w-full justify-center'>
          {displayPokemons}
        </ul>
      )}
      <div className='mt-8 flex flex-wrap justify-center items-center gap-2 max-w-full'>
        <button style={{
          backgroundColor: isDay ? '' : '#023e8a',
          color: isDay ? '' : 'white',
        }} onClick={prev} className='w-10 h-10 bg-[#c62828] rounded-lg text-white hover:scale-105 transition'>&lt;</button>
        {pageButtons()}
        <button style={{
          backgroundColor: isDay ? '' : '#023e8a',
          color: isDay ? '' : 'white',
        }} onClick={next} className='w-10 h-10 bg-[#c62828] rounded-lg text-white hover:scale-105 transition'>&gt;</button>
      </div>
    </section>
  )
}

export default App
