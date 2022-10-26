export const getPokemonDetail = async (name, options = {}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/pokemon/${name}`, options);
}

export const getPokemonList = async (params = { limit: 20, offset: 0 }, options = {}) => {
  const searchParams = new URLSearchParams(params).toString();

  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/pokemon/?${searchParams}`, options);
}

export const getPokemonTypeList = async (params = { limit: 20, offset: 0 }, options = {}) => {
  const searchParams = new URLSearchParams(params).toString();

  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/type/?${searchParams}`, options);
}

export const getPokemonGenerationList = async (params = { limit: 20, offset: 0 }, options = {}) => {
  const searchParams = new URLSearchParams(params).toString();

  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/generation/?${searchParams}`, options);
}

export const getPokemonTypeDetail = async (name, options = {}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/type/${name}`, options);
}

export const getPokemonGenerationDetail = async (name, options = {}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/generation/${name}`, options);
}
