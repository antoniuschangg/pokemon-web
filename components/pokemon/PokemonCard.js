import { useRouter } from "next/router";
import React, { forwardRef, memo } from "react"

const PokemonCard = forwardRef(({ pokemonName, pokedexNumber, onClick }, ref) => {
  const router = useRouter();

  const handleClick = () => {
    if(onClick) {
      onClick();

      return;
    }
    
    router.push('/pokemon/' + pokemonName)
  }

  return (
    <div ref={ref} className="flex flex-row justify-between items-center mb-2 bg-yellow-300 text-blue-500 rounded-lg border py-1 px-3 hover:bg-blue-500 hover:text-yellow-300 cursor-pointer" onClick={handleClick}>
      <div>
        #{('000' + pokedexNumber).slice(pokedexNumber < 1000 ? -3 : -4)} <span className="capitalize">{pokemonName}</span>
      </div>
      <div>
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" fill="#fde047" clip-rule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>
      </div>
    </div>
  )
})

export default memo(PokemonCard);