import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPokemonDetail } from "../services/pokemon";

const ComparePage = () => {
  const router = useRouter();
  const { first_pokemon, second_pokemon } = router.query;
  const [firstPokemon, setFirstPokemon] = useState(null);
  const [secondPokemon, setSecondPokemon] = useState(null);
  
  useEffect(() => {
    if(!first_pokemon || !second_pokemon) return;

    const controller = new AbortController();

    getPokemonDetail(first_pokemon, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setFirstPokemon(data))
      .catch(err => console.log(err.message))

    getPokemonDetail(second_pokemon, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setSecondPokemon(data))
      .catch(err => console.log(err.message))

    return () => {
      controller.abort();
    }
  }, [first_pokemon, second_pokemon])
  
  if(!first_pokemon || !second_pokemon || !firstPokemon || !secondPokemon) return null;


  return (
    <div>
      <Head>
        <title>Pokedex - Compare Pokemon List</title>
        <meta name="description" content="Compare between pokemons! You can search and compare pokemons here!" />
      </Head>
      <header>
        <div className="cursor-pointer" onClick={() => router.push('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </div>
        <h1 className="text-center text-4xl font-bold">Compare</h1>
      </header>
      <div className="flex flex-row">
        <div className="w-6/12 px-1">
          <img srcSet={firstPokemon.sprites.front_default} width={300} height="auto" />
          <div>
            <h2 className="text-3xl capitalize">{firstPokemon.name}</h2>

            <h3 className="text-xl mt-5">Types</h3>
            <div>
              {firstPokemon.types.map(type => type.type.name).join(', ')}
            </div>

            <h3 className="text-xl mt-5">Stats</h3>
            <ul>
              {firstPokemon.stats.map(stat => (
                <li key={stat.stat.name}>
                  <div className="flex flex-row justify-between items-center">
                    <div>{stat.stat.name}</div>
                    <div>{stat.base_stat}</div>
                  </div>
                  <div>
                  <input className="w-full" type="range" value={stat.base_stat} disabled />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-6/12 px-1">
          <img srcSet={secondPokemon.sprites.front_default} width={300} height="auto" />
          <div>
            <h2 className="text-3xl capitalize">{secondPokemon.name}</h2>

            <h3 className="text-xl mt-5">Types</h3>
            <div>
              {secondPokemon.types.map(type => type.type.name).join(', ')}
            </div>

            <h3 className="text-xl mt-5">Stats</h3>
            <ul>
              {secondPokemon.stats.map(stat => (
                <li key={stat.stat.name}>
                  <div className="flex flex-row justify-between items-center">
                    <div>{stat.stat.name}</div>
                    <div>{stat.base_stat}</div>
                  </div>
                  <div>
                  <input className="w-full" type="range" value={stat.base_stat} disabled />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparePage;