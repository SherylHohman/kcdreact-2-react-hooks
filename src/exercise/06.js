// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm} from '../pokemon'
// 🐨 you'll want the following additional things from the'../pokemon' file:
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
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
      // Setting pokemon to null clears previous result and
      //  re-renders image to show loading screen until response is received.
      //  If fetch fails, well, the loading screen remains
      //  If fetch is successful, setState updates and re-renders with new pokemon.
      setPokemon(null)

      fetchPokemon(pokemonName)
        .then(pokemonData => {
          setPokemon(pokemonData)
        })
        .catch(error => {
          console.log('error fetching: ', error)
          // setPokemon(error.message)
          // ideally, the error message would show, but our current UI options
          //  do not have provisions for this.
          //  Instead, the loading screen remains.
        })
    }

    // I am using a wrapper because the return value for useEffect is supposed
    //  to be the cleanup function.
    // Solution did NOT use a wrapper, and also did not use a catch
    // :-((  Did I do unnecessary work. Make it too complicated?

    //  If not wrapped, this is what *I* think would happen:
    //  1) the early return sets an empty cleanup function.
    //    while this is what we want in this case, it is being accidentally set
    //    to that value for the wrong reasons. A code change could produce errors.
    //    The code is misleading.
    //  2) Hmm. Doesn't a promise always have a return value?
    //    I might be wrong on this, or misunderstand. But is not an implicit
    //    `.then()` part of this? I need to re-read promises and asynch/await
    //    to be sure. Anyway, if so, then that is also being set as a returned
    //    cleanup value in the case of a successful fetch.
    //    Maybe it is only asynch/await that causes this type of issue?
    //    Or perhaps I misunderstand altogether, and there is no issue at all.

    fetchPokemanWrapper()
    // TODO: 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    // fetchPokemon(pokemonName)
    // .then
    //     pokemonData => {/* update all the state here */},
    //   )
    return // no cleanup necessary
  }, [pokemonName])

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // version 1:
  // const output = function () {
  //   if (!pokemonName) return 'Submit a pokeman'
  //   if (!pokemon) return <PokemonInfoFallback name={pokemonName} />
  //   return <PokemonDataView pokemon={pokemon} />
  // }

  //  return <div>{output()}</div>

  // version2:
  /* return (
    <div>
      {!pokemonName ? (
        'Submit a pokeman'
      ) : !pokemon ? (
        <PokemonInfoFallback name={pokemonName} />
      ) : (
        <PokemonDataView pokemon={pokemon} />
      )}
    </div>
  ) */

  // version3:
  /* return (
    <div>
      {(!pokemonName && 'Submit a pokeman') ||
        (pokemon ? (
          <PokemonDataView pokemon={pokemon} />
        ) : (
          <PokemonInfoFallback name={pokemonName} />
        ))}
    </div>
  )
 */

  // version 4: (dummy, this is version 1, but no separate function needed!! duh!)
  if (!pokemonName) return 'Submit a pokeman'
  if (!pokemon) return <PokemonInfoFallback name={pokemonName} />
  return <PokemonDataView pokemon={pokemon} />
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
