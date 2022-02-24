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

    // v1: previous exercise 06.extra-2
    // HERE, ORDER MATTERS! in asynch calls, React cant (yet) gaurantee all are updated in the same render cycle. In actuallity in THIS particular version of THIS app, might not cause an error b/c the combo of prev values + what would try to render if any of these values are updated before others, would not create an "undefined" or unrenderable situation, I think. But it COULD, in general.
    /* setStatus(PENDING)
		   setPokemon(null)
       setFetchError(null)*/

    // v2: update all the properties & v3: change only changed properties
    // setState({status: PENDING, pokemon: null, error: null})
    /* setFetchError(null)
       setPokemonStatus({status: PENDING, pokemon: null}) */

    // v4: remove properties that are unused (and "null") by component when has this status
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

				// v1: previous exercise 06.extra-2
				// HERE, ORDER MATTERS, switch the 2 lines and a RUNTIME ERROR occurs. in asynch calls, React cant (yet) gaurantee all are updated in the same render cycle
				/* setPokemon(pokemon)
					 setStatus(RESOLVED)
					*/

        // v2: update all the properties
        // setState({pokemon, status: RESOLVED, error: null}) // error has not changed

        // v3: update CHANGED properties, reuse UNCHANGED properties
        // setState(prev => ({...prev, pokemon, status: RESOLVED})) // error has not changed

        // v4: remove properties that are unused (and ==="null") by component when has this status
        //  In v3, v2, v1: we kept the `error` property at "null";
        //  In this version, it no longer exists on our state object
        //  ...so by def, it is "undefined".
        //	But, the app never uses `error` property during a render when status is RESOLVED!
        setState({pokemon, status: RESOLVED}) // error property no longer exists

        // console.log('setPokemonStatus:', state, RESOLVED)
      })
      .catch(error => {
        // v1: previous exercise 06.extra-2
        // ORDER does NOT matter, because only 1 exists in this asynch call!
        // which is why I initially left it OFF my state object during 1st v of exercise 2
        /*setStatus(REJECTED) */

        // v2: update all the properties
        // setState({error, status: REJECTED, pokemon: null}) // pokeman has not changed
        //				or
        // setPokemonStatus({status: REJECTED, pokemon: null})
        // setFetchError(error)

        // v3: update CHANGED properties (only); reuse UNCHANGED properties
        // setState(prev=>({...prev, error, status: REJECTED})) // pokeman has not changed
        //				or
        // setPokemonStatus(prev => ({...prev, status: REJECTED}))
        // setFetchError(error)

        // v4: remove properties that are unused (and ==="null") by component when has this status
        //  In v3, v2, v1: we kept the `pokemon` property at "null";
        //  In this version, it no longer exists on our state object
        //  ...so by def, it is "undefined".
        //	But, the app never uses `pokemon` property during a render when status is REJECTED!
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

			06.extra-3 refactor: remove "null" state from obj

			In solution video, Kent "removes" the unused state properties from the
				object during setState calls, for the properties that (would be) set
				to "null"	during that update and will not be used anywhere in the app
				during that render cycle.

				eg. 	  setState({status: PENDING})
				mine 	  setState({status: PENDING, pokemon: null, error: null})

				eg.			setState({status: REJECTED, error})
				vs			setState({status: REJECTED, error, pokemon: null})
				or			setState(prev=>({...prev, status: REJECTED, error}))
				In this case the previous value of pokemon was already null before setState

				pokemon and error are not used in UI (or ANYWHERE) when status is PENDING,
								so why set it, or have those properties ("variables") even exist
								(for that render), I suppose it the logic.
								Anyway, at the time of the setState call to update the var,
								they were KNOWN to have a null value, and null works "the same"
								as undefined in MOST* cases, anyway it would for our use in this app.
								So if the app did erroneously try to access those values, the
								app and UI would respond the same as if those properties DID
								exist on the object, and were set the the value "null", rather
								than not existing on the object, and thus being "undefined".
								*(Of course this depends on if "falsey"/?? comparisons are
								being used or if === null/.? was being used -- but in that case
								there would likely be an error anyway, because the property
								would not even exist, so undefined on the left-hand side).

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
