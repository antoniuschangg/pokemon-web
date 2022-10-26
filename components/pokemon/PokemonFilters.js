import { useEffect, useState } from "react";
import { getPokemonGenerationList, getPokemonTypeList } from "../../services/pokemon";

export default function PokemonFilters({ onApply, disabled }) {
  const [types, setTypes] = useState([]);
  const [generations, setGenerations] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    getPokemonTypeList({ limit: 10000, signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setTypes(data.results);
      })
      .catch(err => console.log(err.message));

    getPokemonGenerationList({ limit: 10000, signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setGenerations(data.results);
      })
      .catch(err => console.log(err.message));

    return () => {
      controller.abort();
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    let selectedTypes = [];
    let selectedGenerations = [];

    [...e.target.elements].forEach(element => {
      if(element.name === 'types[]' && element.checked) {
        selectedTypes.push(element.value);
      }
      if(element.name === 'generations[]' && element.checked) {
        selectedGenerations.push(element.value)
      }
    })

    onApply({
      types: selectedTypes,
      generations: selectedGenerations
    })
  }

  return (
    <div className="border p-3 mb-5">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">Search Your Pokemon</h2>
        <h3>Select Types</h3>
        <div className="flex flex-row flex-wrap">
          {types.map(type => (
            <label className="block" style={{ width: '33%' }}>
              <input className="mr-2" name="types[]" type="checkbox" value={type.name} />
              {type.name}
            </label>
          ))}
        </div>

        <h3 className="mt-5">Select Generations</h3>
        <div className="flex flex-row flex-wrap">
          {generations.map(generation => (
            <label className="block" style={{ width: '50%' }}>
              <input className="mr-2" name="generations[]" type="checkbox" value={generation.name} />
              {generation.name}
            </label>
          ))}
        </div>
        
        <div className="text-center mt-3">
          <button className="bg-yellow-300 px-4 py-2 rounded-lg" type="submit" disabled={disabled}>Search</button>
        </div>
      </form>
    </div>
  )
}