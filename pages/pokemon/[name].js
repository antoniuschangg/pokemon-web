import { useRouter } from "next/router";
import { getPokemonDetail, getPokemonList } from "../../services/pokemon";

export default function PokemonDetailPage({ pokemon }) {
  const router = useRouter();

  if(!pokemon) return <div>Loading...</div>;

  return (
    <main>
      <header>
        <div className="cursor-pointer" onClick={() => router.push('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </div>
      </header>
      <img srcSet={pokemon.sprites.front_default} width={500} height="auto" />
      <article>
        <h1 className="text-5xl capitalize">{pokemon.name}</h1>

        <h2 className="text-2xl mt-5">Types</h2>
        <div>
          {pokemon.types.map(type => type.type.name).join(', ')}
        </div>

        <h2 className="text-2xl mt-5">Stats</h2>
        <ul>
          {pokemon.stats.map(stat => (
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
      </article>
    </main>
  )
}

export async function getStaticProps({ params }) {
  const name = params.name;

  let data = await getPokemonDetail(name)
  data = await data.json();

  return {
    props: {
      pokemon: data,
    },
    revalidate: 30
  }
}

export async function getStaticPaths() {
  let pokemons = await getPokemonList({ limit: 100000 });
  pokemons = await pokemons.json();
  
  let paths = [];

  pokemons.results.forEach((item) => {
    paths.push({
      params: {
        name: item.name,
      },
    });
  });

  return {
    paths,
    fallback: true,
  };
}