// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      console.log('exit early')
      return console.log('useEffect cleanup, after early return') // no cleanup necessary
    }

    setPokemon(null)

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
      })
      .catch(error => {
        console.log('error fetching: ', error)
      })

    return console.log('useEffect cleanup') // no cleanup necessary
  }, [pokemonName])

  // render the pokemon card
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

/*	06.extra-1 instructions

Unfortunately, sometimes things go wrong and we need to handle errors when they
	do so we can show the user useful information.
	Handle that error and render it out like so:

		<div role="alert">
			There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
		</div>

	You can make an error happen by typing an incorrect pokemon name into the input.

One common question I get about this extra credit is how to handle promise errors.
There are two ways to do it in this extra credit:

// option 1: using .catch
		fetchPokemon(pokemonName)
			.then(pokemon => setPokemon(pokemon))
			.catch(error => setError(error))

// option 2: using the second argument to .then
		fetchPokemon(pokemonName).then(
			pokemon => setPokemon(pokemon),
			error => setError(error),
		)

These are functionally equivalent for our purposes, but they are semantically
	different in general.

Using .catch means that you’ll handle an error in the fetchPokemon promise,
	but you’ll also handle an error in the setPokemon(pokemon) call as well.
	This is due to the semantics of how promises work.

Using the second argument to .then means that you will catch an error that
	happens in fetchPokemon only. In this case, I knew that calling setPokemon
	would not throw an error (React handles errors and we have an API to catch
	those which we’ll use later), so I decided to go with the second argument
	option.

However, in this situation, it doesn’t really make much of a difference.
	If you want to go with the safe option, then opt for .catch.

*/

/*  SH Notes:

    RE: Why set pokemon null before fetch
      SH: Setting pokemon to null clears previous result and
      re-renders image to show loading screen until response is received.
      If fetch fails, well, the loading screen remains
      If fetch is successful, setState updates and re-renders with new pokemon.

    RE: Wrapper

      Update:
      I guess wrapper for calling the fetchPokemon (returns Promise) is not necessary.
      I guess the fetchPokemon() call *IS* the wrapped function?
      It is the only level of wrapping that we need?
      Only need an additional layer of wrapping if using asynch await.

          React.useEffect(() => {
            async function effect() {
              const result = await doSomeAsyncThing()
              // do something with the result
            }
            effect()
          })

      For Promises, this works:

          React.useEffect(() => {
            doSomeAsyncThing().then(result => {
              // do something with the result
            })
          })

		  Their solution does not use a wrapper. Why?
      I am using a wrapper because the return value for useEffect is supposed
      to be the cleanup function.
      Solution did NOT use a wrapper, and also did not use a catch
      :-((  Did I do unnecessary work. Make it too complicated?

      If not wrapped, this is what *I* think would happen:
      1) the early return sets an empty cleanup function.
        while this is what we want in this case, it is being accidentally set
        to that value for the wrong reasons. A code change could produce errors.
        The code is misleading.
      2) Hmm. Doesn't a promise always have a return value?
        I might be wrong on this, or misunderstand. But is not an implicit
        `.then()` part of this? I need to re-read promises and asynch/await
        to be sure. Anyway, if so, then that is also being set as a returned
        cleanup value in the case of a successful fetch.
        Maybe it is only asynch/await that causes this type of issue?
        Or perhaps I misunderstand altogether, and there is no issue at all.

    */
