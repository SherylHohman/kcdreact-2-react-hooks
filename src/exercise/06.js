// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm} from '../pokemon'
import {fetchPokemon, PokemonDataView, PokemonInfoFallback} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState(null)

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!

  React.useEffect(() => {
    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    //   fetchPokemon('Pikachu').then(
    //     pokemonData => {/* update all the state here */},
    //   )

    const fetchPokemanWrapper = function () {
      if (!pokemonName) {
        return // do not fetch, return early
      }
      fetchPokemon(pokemonName).then(pokemonData => {
        /* update all the state here */
        setPokemon(pokemonData)
      })
      // TODO: add catch for the case where the request fails
    }
    // TODO: 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    // fetchPokemon(pokemonName)
    // .then
    //     pokemonData => {/* update all the state here */},
    //   )

    // why? In case of fetch error?
    setPokemon(null)
    // It does not seem right to use the setState hook here.
    // Do I just set it directly here?
    // Well, maybe setState *is* correct? Resets to loading or unknown value
    //  until the http request responds? Ponder over it.
    fetchPokemanWrapper()

    return // no cleanup necessary
  }, [pokemonName])

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  const output = function () {
    if (!pokemonName) return 'Submit a pokeman'
    if (!pokemon) return <PokemonInfoFallback name={pokemonName} />
    return <PokemonDataView pokemon={pokemon} />
  }

  return <div>{output()}</div>
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
