// useEffect: HTTP requests
// 💯 create an ErrorBoundary component
// http://localhost:3000/isolated/exercise/06.extra-4.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

// SH fetch states (I prefer CONST over strings for catching typos)
const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

class ErrorBoundary extends React.Component {
  // This component must wrap the Component UI that it is supposed to respond to
  // must be created as a class Component

  // constructor(props) {
  constructor({error, pokemonName, ...props}) {
    super(props)
    this.state = {error: null, errorInfo: null}
  }
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    // You can also log error messages to an error reporting service here
    console.log('errorReportingService: ', error)

    // this standard method allows the error to also be passed to an
    //	error reporting service, in addition to rendering the error UI
    //  here, I will simply add a console.log

    // static getDerivedStateFromError(error, pokemanName) {
    //   // update this component's state so that at next render this component will
    //   //	render itself
    //   return {hasError: true}
    // }
  }
  render(pokemanName) {
    // error UI:
    if (this.state.hasError) {
      return <div>"Uh oh, could not retrieve pokeman: " {pokemanName}</div>
    }
    // otherwise, render the usual (wrapped) UI
    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: IDLE,
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return //() => console.log('1. clean up after empty-string') // no cleanup necessary
    }

    setState({status: PENDING}) // pokemon and error will not exist on state.

    // because setState is asynch, this log prints before the state values are updated
    console.log('2. ', PENDING, '   (   updating from old state:', state)

    fetchPokemon(pokemonName)
      .then(pokemon => {
        // prettier-ignore
        // (keep on one line, please)
        // because setState is asynch, this log prints before the state values are updated
        console.log( '4. ', RESOLVED, '   (   updating from old state:', state, '\n',)

        setState({pokemon, status: RESOLVED}) // error property no longer exists
      })
      .catch(error => {
        // prettier-ignore
        // (keep on one line, please)
        // because setState is asynch, this log prints before the state values are updated
        console.log( '4. ', REJECTED, '   (   updating from old state:', state, '\n',)

        setState({error, status: REJECTED}) // pokeman property will no longer exist on state
      })
    console.log('3. ...exiting useEffect')
    return //() => console.log('1. clean up') // no cleanup necessary
  }, [pokemonName]) // do not included `state`! Endless re-renders
  // It is ONLY b/c of console.logs that `state` is even in this function!

  // RENDER

  // NOW, state has been updated, display values. They were inaccurate when logged
  //		immediately after calling setState in the useEffect function)
  console.log('RENDERING state:', state)

  const {status, pokemon, error} = state
  if (status === REJECTED) {
    /* return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    ) */

    // replace above with ErrorBoundry
    // Simulate a JS, UI rendering error (ie if tried to render some undefinced thing)
    throw new Error(error)
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
        <ErrorBoundary pokemonName={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

/*	06.extra-4 instructions 4. 💯 create an ErrorBoundary component

We’ve already solved the problem for errors in our request, we’re only handling
	that one error. But there are a lot of different kinds of errors that can
	happen in our applications.

No matter how hard you try, eventually your app code just isn’t going to behave
	the way you expect it to and you’ll need to handle those exceptions. If an
	error is thrown and unhandled, your application will be removed from the
	page, leaving the user with a blank screen… Kind of awkward…

Luckily for us, there’s a simple way to handle errors in your application using
	a special kind of component called an Error Boundary. Unfortunately, there is
	currently no way to create an Error Boundary component with a function and
	you have to use a class component instead.

In this extra credit, read up on ErrorBoundary components
  https://reactjs.org/docs/error-boundaries.html#how-about-trycatch
	and try to create one that handles this and any other error for the
	PokemonInfo component.

💰 to make your error boundary component handle errors from the PokemonInfo
	component, instead of rendering the error within the PokemonInfo component,
	you’ll need to throw error right in the function so React can hand that to
	the error boundary. So if (status === 'rejected') throw error.
 */

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

			06.extra-3 COMMENTS and setState order within useEffet
				(from commit message)

				add tons of comments and console.logs
				updated minor bugs RE: logging and implications of where logs were.

				special attention paid to RE: ordering of useState and console.log output
				This has implications much beyond console.logs.
				TLDR; order matters inside asynch func.
				TBF, I should not be printing out a variable that is not included as
					a dependancy. It should only be printed OUTSIDE the useEffect function.
					(If I added it to the dependacy list, though, it would infinite-loop)

				This is a lesson as to why the dependacy array is so important!

				It also provides an interesting illustration of:
				1) setState being both asynch, but also gauranteed for useEffect
				2) Lifecycle order
				3) closures inside useEffect, combined with Lifecycle order
				5) the JS event loop, perhaps
				4) Order matters inside asynch functions. // maybe that is not in play here.
						// my comments suggest it is, but I may have been mistaken. I now think
						// those other factors may account for everything.

				Remember, I am keeping comments and console.logs because this file is
					a teaching document, and a record of my learning process.


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

		  PREVIOUS: NOTE, I was WRONG below! (Explanation in instructions was slightly confusing to me! Dunno if it caused the same misunderstanding to others, or just to me!)
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
