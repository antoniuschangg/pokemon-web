import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import PokemonCard from '../components/pokemon/PokemonCard'
import PokemonFilters from '../components/pokemon/PokemonFilters'
import { getPokemonGenerationDetail, getPokemonList, getPokemonTypeDetail } from '../services/pokemon'

export default function Home() {
  const controller = useRef();
  const observer = useRef();
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);
  const [isPaginationEnded, setIsPaginationEnded] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPokemons, setSelectedPokemons] = useState([]);


  useEffect(() => {
    controller.current = new AbortController();

    fetchData();

    return () => {
      controller.current.abort();
    }
  }, [])

  const lastItemRef = useCallback((node) => {
    if(isFetching) return;

    if(observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !isPaginationEnded) {
        fetchData()
      }
    });

    if(node) {
      observer.current.observe(node);
    }
  }, [isFetching, isPaginationEnded, pokemons.length])
  
  const fetchData = async (refresh = false) => {
    if(isFetching) return;
    if(!refresh && isPaginationEnded) return;

    setIsFetching(true);

    getPokemonList(
      {
        limit: 100,
        offset: refresh ? 0 : pokemons.length,
      },
      { signal: controller.current.signal }
    )
      .then(res => res.json())
      .then(data => {
        setIsPaginationEnded(data.results < 100);
        
        setPokemons(prev => refresh ? data.results : prev.concat(data.results))
      })
      .catch(err => console.log(err.message))
      .finally(() => {
        setIsFetching(false);
      })
  }

  const handleFilter = async ({ types, generations }) => {
    if(!types.length && !generations.length) {
      fetchData(true);

      return;
    }

    const typesSet = {};
    const pokemonsSet = {};

    if (generations.length) {
      const generationsResponse = await Promise.all(
        generations.map((name) => getPokemonGenerationDetail(name, { signal: controller.current.signal }))
      );
  
  
      for(let i = 0; i < generationsResponse.length; i++) {
        const data = await generationsResponse[i].json();
  
        data.types.forEach(type => {
          if(types.length === 0 || types.includes(type.name)) {
            typesSet[type.name] = type
          }
        });
      }
    } else {
      types.forEach(item => typesSet[item] = ({ name: item }))
    }

    const typesResponses = await Promise.all(
      Object.keys(typesSet).map((name) => getPokemonTypeDetail(name, { signal: controller.current.signal }))
    );

    for(let i = 0; i < typesResponses.length; i++) {
      const data = await typesResponses[i].json();

      data.pokemon.forEach(item => pokemonsSet[item.pokemon.name] = item.pokemon);
    }

    setIsPaginationEnded(true);

    setPokemons(Object.values(pokemonsSet));
  }

  const handleSelectPokemon = (pokemon) => {
    if(selectedPokemons.length >= 2) return;
    
    setSelectedPokemons(prev => prev.concat(pokemon));
  }

  const handleCompareCTA = useCallback(() => {
    const newValue = !compareMode;

    if(!newValue) {
      setSelectedPokemons([]);
    }

    setCompareMode(newValue);
  }, [compareMode])

  return (
    <div>
      <Head>
        <title>Pokedex - Pokemon List</title>
        <meta name="description" content="Pokedex pokemon list wiki. You can search and compare pokemons here!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative">
        <h1 className="text-4xl text-center font-extrabold mb-5">
          Pokedex
        </h1>

        <PokemonFilters disabled={compareMode} onApply={handleFilter} />

        <div className="text-right mb-5">
          <button className="bg-blue-500 px-3 py-1 rounded-lg text-yellow-300" onClick={handleCompareCTA}>
            {compareMode ? 'Cancel Compare' : 'Compare'}
          </button>
        </div>

        {pokemons.map((poke, index) => 
          index === pokemons.length - 1 ? (
            <PokemonCard ref={lastItemRef} key={poke.name} pokemonName={poke.name} pokedexNumber={index + 1} onClick={compareMode ? () => handleSelectPokemon(poke) : null} />
          ) : (
            <PokemonCard key={poke.name} pokemonName={poke.name} pokedexNumber={index + 1} onClick={compareMode ? () => handleSelectPokemon(poke) : null}  />
          )
        )}

        {compareMode && (
          <div className="fixed mx-auto max-w-sm bottom-0 left-0 right-0 py-3 bg-blue-500 px-3 text-yellow-300">
            {selectedPokemons.length ? (
              <div className="flex flex-row justify-between">
                <div>{selectedPokemons[0].name} vs {selectedPokemons[1]?.name}</div>
                {selectedPokemons.length === 2 && <div className="cursor-pointer font-bold" onClick={() => router.push(`/compare?first_pokemon=${selectedPokemons[0]?.name}&second_pokemon=${selectedPokemons[1]?.name}`)}>GO!</div>}
              </div>
            ) : (
              <div>Select 2 Pokemons</div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
