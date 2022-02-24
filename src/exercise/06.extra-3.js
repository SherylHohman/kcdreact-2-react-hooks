// useEffect: HTTP requests
// 💯 store the state in an object
// http://localhost:3000/isolated/exercise/06.extra-3.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

// fetch states (prefer CONST over strings for catching typos)
const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function PokemonInfo({pokemonName}) {
  /* const [pokemon, setPokemon] = React.useState(null)
     const [status, setStatus] = React.useState(IDLE)
     const [fetchError, setFetchError] = React.useState(null)
    */
  const [state, setState] = React.useState({
    status: IDLE,
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return //() => console.log('clean up after empty-string') // no cleanup necessary
    }

    /* setFetchError(null)
       setStatus(PENDING) */
    // setState({status: PENDING, pokemon: null, error: null})
    // setState({status: PENDING, pokemon: null, error: null})

    setState({status: PENDING}) // pokemon and error no longer exist.
    // Our code will not try to access them with this status.
    // And in any case, In our code null and undefined have same result

    // console.log('setPokemonStatus:', state, PENDING)

    fetchPokemon(pokemonName)
      .then(pokemon => {
        /*
        // has to be in this order, else an error occurs! pokemon before status
        // setState calls cannot be gauranteed to be batched together when within
        //  asynch callbacks! Hence the error.
        //  So one solution is to put them on the *same* state variable.
        //  (in an object). Then only a single call is required and it is
        //	gauranteed to be updated at the same time.
        //  Remember, the issue was that during re-render, RESOLVED was updated
        //	so render tried tried to display the pokemon, which was still null
        //	(based on status telling React which JSX to display)
        //	pokemon would not be updated until the immediately next rerender.

        setPokemon(pokemon)
        setStatus(RESOLVED)
				*/

        // setState({pokemon, status: RESOLVED, error: null}) // error has not changed
        // setState(prev => ({...prev, pokemon, status: RESOLVED})) // error has not changed

        // error property was null, now it is undefined as it no longer exists
        //	on our object; the app never needs it when in RESOLVED state
        setState({pokemon, status: RESOLVED}) // error property no longer exists

        // console.log('setPokemonStatus:', state, RESOLVED)
      })
      .catch(error => {
        /*setStatus(REJECTED) */
        // setPokemonStatus(prev => ({...prev, status: REJECTED}))
        // or can do like below, but in general it looks prone to introducing
        // errors if app grows and changes: do not "change" anything that does not need to

        // setState({error, status: REJECTED, pokemon: null}) // pokeman has not changed

        // pokemon property was null, now it is undefined as it no longer exists
        //	on our object; the app never needs it when in a REJECTED state
        setState({error, status: REJECTED}) // pokeman property no longer exists

        // console.log('setPokemonStatus:', state, REJECTED)
      })

    return //() => console.log('clean up') // no cleanup necessary
  }, [pokemonName]) // do not included pokemonStatus! Endless re-renders

  const {status, pokemon, error} = state
  if (status === REJECTED) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }

  if (status === IDLE) return 'Submit a pokeman'
  if (status === PENDING) return <PokemonInfoFallback name={pokemonName} />
  if (status === RESOLVED) return <PokemonDataView pokemon={pokemon} />
  throw new Error(
    `Unknown Status: ${status}. This line of code should never be reached`,
  )
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

/*	06.extra-3 instructions 3. 💯 store the state in an object

You’ll notice that we’re calling a bunch of state updaters in a row.
This is normally not a problem, but each call to our state updater can result
in a re-render of our component.
React normally batches these calls so you only get a single re-render,
but it’s unable to do this in an asynchronous callback
(like our promise success and error handlers).

So you might notice that if you do this:

		setStatus('resolved')
		setPokemon(pokemon)

You’ll get an error indicating that you cannot read image of null.
This is because the setStatus call results in a re-render that happens before
the setPokemon happens.

In the future, you’ll learn about how useReducer can solve this problem really
elegantly, but we can still accomplish this by storing our state as an object
that has all the properties of state we’re managing.

See if you can figure out how to store all of your state in a single object
with a single React.useState call so I can update my state like this:

		setState({status: 'resolved', pokemon})

*/

/*	06.extra-2 instructions 2. 💯 use a status

Our logic for what to show the user when is kind of convoluted and requires that
 we be really careful about which state we set and when.

We could make things much simpler by having some state to set the explicit
status of our component. Our component can be in the following "states":

	idle			: no request made yet
	pending		: request started
	resolved	: request successful
	rejected	: request failed

Try to use a status state by setting it to these string values rather than
relying on existing state or booleans.

Learn more about this concept here:
https://kentcdodds.com/blog/stop-using-isloading-booleans

💰 Warning: Make sure you call setPokemon before calling setStatus.
We’ll address that more in the next extra credit.
*/

/*	06.extra-1 (handle fetch errors) instructions:

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

		RE: 3. state in object
06.extra-3 refactor: remove "null" state props

		In solution video, Kent "removes" the unused state properties from the
			object during setState calls, for the properties that (would be) set
			to "null"	during that update and will not be used anywhere in the app
			during that render cycle.

			eg. 	  setState({status: PENDING})
			not 	  setState({status: PENDING, pokemon: null, error: null})

			pokemon and error are not used in UI (or ANYWHERE) when status is PENDING,
							so why set it. Anyway, they are KNOWN to have a null value
							just before the update, and null works the same as undefined
							for our purposes, so if the app did erroneously try to access
							those values, it would respond the virtually the same as if
							they had been defined/set to "null", rather than being
							undefined because they do not exist on the object

			eg.			setState(prev => {...prev, status: IDLE})
							// error and pokemon are (still) null

			orig		setState({status: IDLE, pokemon: null, error: null})


		RE: role="alert"
		role="alert" tells screen readers to read it right away, (alert message)
		eg: 	<div role="alert"> ...stuff to alert... </div>

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
