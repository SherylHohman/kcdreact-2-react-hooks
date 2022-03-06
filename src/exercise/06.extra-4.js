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

  // Error boundaries work like a JavaScript catch {} block, but for components.

  // A class component becomes an error boundary if it defines either (or both)
  //  of the lifecycle methods
  //  	-	static getDerivedStateFromError() or
  // 		-	componentDidCatch().

  //Use static getDerivedStateFromError() to render a fallback UI
  //	after an error has been thrown.
  //Use componentDidCatch() to log error information.

  // eslint calls this a useless constructor and wants me do delete it.
  // eslint-disable-next-line no-useless-constructor

  constructor(props) {
    super(props)
    // const {ErrorFallbackComponent, pokemonName, ...otherProps} = props
    // define state for this component here. eg:
    // this.state={hasError: false}
    // this.state={error: null}
    this.state = {errorBoundaryError: null} // this is local, not the error
    //		passed in via getDerivedStateFromError(error), yet anyway
    // Note I am NOT calling the property "state", because I want to distingish
    //   it from where the "error" IS PASSED IN
  }

  // state = {errorBoundaryError: null} // this is local, not the error

  // * instead of using the constructor above, can instead just write the line below
  // state = {errorBoundaryMessage: null} // this is local, not the error passed in
  // state={error: null}

  // * since setting state is the only thing we are using constructor for, we can
  //	let React implicitely create the constructor function for us, and do the
  //	following INSTEAD of above:
  // state = {errorBoundaryMessage: null} // this is local, not the error passed in

  // From docs or tutorial:
  //		// 	getDerivedStateFromError does the only thing it is good for,
  //		// 	i.e. updates the state if an error occurs, while
  //		// componentDidCatch provides side effects and can access this
  //		// 	component instance if needed.

  static getDerivedStateFromError(error) {
    // error that is passed in here comes from outside, it is NOT from props
    //	it is captured whenever an error is THROWN from a wrapped component
    //	When that happens, React looks to see if a parent component of the one
    //	that threw an error has one of the these two methods on it:
    //			getDerivedStateFromError(error)
    //			componentDidCatch(error, errorInfo)
    //	if so, it sais, hey this is an "Error Boundary" component, and
    //	calls this method, passing in the thrown Error object

    //   // The getDerivedStateFromError() method is invoked if some error occurs
    //   // 	during the rendering phase of any lifecycle methods or any children
    //   //	components. This method is used to implement the Error Boundaries for
    //   // 	the React application. It is called during the render phase, so
    //   // 	side-effects are not permitted in this method.
    //   // 	For side-effects, use componentDidCatch() instead.

    //   // if use state, set it here eg:
    //   // setState({hasError: true})
    // return error    // WRONG! this needs to be state object format
    // return {error}  // CORRECT, notice it is shorthand for:
    // return {error: error}

    console.log('getDerivedStateFromProps: ')
    console.dir(error)
    return {errorBoundaryError: error}

    //	// Ah Haaaa! from video:
    //	//	>[By adding this getDerivedStateFromError method, we not only turn this
    //	//		component into one that handles errors...
    //	//		]
    //	//	>It'll [the component will] give us an error.
    //	//	(that means the this method gives us access to
    //	//		an error object that is generated by React during one of its
    //	//		Lifecycle, rendering, or ??oneOtherSituation?RemWhat phases.
    //	//	)

    //	//	>Then we can just return an *object* of[sic., depicting]
    //	//		the state that we want this error boundary to have
    //	//		when there's an error in itself or any of its children.

    //	//	(essentially it is like calling setState{error: error})

    //	//  >We're going to take that error and just put it into state.
    //	//  >Let's go ahead and initialize that state. We'll say error is null.

    //	//	(This means in constructor, we need to create a state var to store the
    //	//		error we get from getDerivedStateFromError ONTO the local error var
    //	//	)
  }

  /*
	// From docs or tutorial:
	  // getDerivedStateFromError and componentDidCatch
		// They are catching same errors but at different phases.

		// 		static getDerivedStateFromError() {
		// 			return { hasError: true };
		// 		}
		// and
		// 		componentDidCatch() {
		// 			this.setState({ hasError: true });
		// 		}
		// do the same thing.

		// However you *can* use both, with a separation of concerns, as is shown in
		// 	in the React docs. In that case,
		// 	- getDerivedStateFromError sets state var so at next render, the
		//    	fallback UI shows.
		// 	- componentDidCatch sends message to a logging service, and
	*/
  // componentDidCatch(error, errorInfo) {
  // 		Catch errors in any components below and re-render with error message
  // 				this.etState({
  // 					error: error,
  // 					errorInfo: errorInfo
  // 				})
  // 		You can also log error messages to an error reporting service here
  //   console.log('SH componentDidCatch logs ErrorBoundry message:\n', error)
  //   // we can simulate a fake logging service by creating a method on this
  //   //	ErrorBoundry class component that points to console.log
  //   //		loggingService = console.log
  //   // then call this loggingService from this componentDidCatch method.
  //   // 		eg this.loggingService(error, info.componentStack)
  // console.log(
  //   `-- componentDidCatch (just for funsies): \n\t error.message: ${error.message}, error:${error} errorInfo:${errorInfo}`,
  //   `\n\t errorBoundaryMessage.message:${this.state.errorBoundaryMessage.message}`,
  // )
  // console.log(
  //   `-- componentDidCatch (just for funsies): \n\t error.message: ${error.message}`,
  // )
  // console.log(`-- componentDidCatch (just for funsies): \n\t error:${error}`)
  // console.log(
  //   `-- componentDidCatch (just for funsies): \n\t errorInfo:${errorInfo}`,
  // )
  // console.log(
  //   '-- Notice: componentDidCatch console.log gets called AFTER the errorBoundary UI is run and printed to the screen.',
  //   "\n This seems to fall in line with its usual use as a logging service--AFTER getDerivedStateFromError and the errorBoundary UI gets printed as React's first priority.",
  // )
  // can do the following in this function
  //			this.setState( {errorBoundaryMessage: error} )
  // though will usually update the state instead from the method:
  //			getDerivedStateFromError(error)
  //	and set the state from *that* function/method via its return statement:
  //	  ie: return {errorBoundaryMessage: error}
  // }

  render(props) {
    const theError = this.state.errorBoundaryError
    const pokemonName = this.props.pokemonName

    console.log('**in errorBoundary:', theError?.message, theError)

    if (theError) {
      console.log(
        ' , error render version of ErrorBoundary UI, pokemonName:',
        pokemonName,
        'theError:',
        theError,
      )

      // this error Boundary UI replaces any broken (children) UI.
      //  That broken UI is alsoe removed by React
      // In our case, below is what we used to have in the PokemonInfo on
      //	status===REJECTED

      // This is called the "FallbackUI". Often it will be defined in a separate
      //	component, and that component will be called below, with the
      //	error passed in as a prop

      /*
			// return (
      //   <div role="alert">
      //     There was an error:{' '}
      //     {<pre style={{whiteSpace: 'normal'}}>{error.message}</pre>}{' '}
      //   </div>
      // )
			*/

      // Instead of above, use a passed in Fallback Component to define the
      //	rendered UI for a Boundary error. This maes it easy to use the
      //	ErrorBoundary component in multiple locations in the app, sort of as a
      //	framework for errors,
      //  and can allow for different for different rendered UI, depending on
      //	location (ie type of error).
      /* NOTICE ErrorFallbackComponent has 1st letter CAPITALIZED */
      return (
        <this.props.ErrorFallbackComponent
          error={theError}
          pokemonName={pokemonName}
        />
      )
    }

    // else...
    // if (!error) {
    // if no error, then render the wrapped children,
    //		as if this wrapping errorBoundary component did not even exist.
    console.log('ErrorFallbackComponent, normal render')
    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: IDLE,
    pokemon: null,
    fetchError: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return // no cleanup function needed
    }

    setState({status: PENDING}) // pokemon and error will not exist on state.

    // method 1: use then/catch
    // fetchPokemon(pokemonName)
    //   .then(pokemon => {
    //     setState({pokemon, status: RESOLVED}) // error property no longer exists
    //   })
    //   .catch(fetchError => {
    //     setState({fetchError, status: REJECTED}) // pokeman property will no longer exist on state
    //   })

    // method 2: use then(success, failure)
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon, status: RESOLVED}) // error property no longer exists
      },
      fetchError => {
        setState({fetchError, status: REJECTED}) // pokeman property will no longer exist on state
      },
    )
    return // no cleanup function needed
  }, [pokemonName]) // do not included `state`! else: Endless re-renders. It is
  // ONLY if/when have console.logs that print `state` is even in this function!

  // RENDER

  // NOW, state values have been updated. They were inaccurate when console.log
  //		was called from inside the useEffect function)
  console.log('RENDERING state:', state)

  const {status, pokemon, fetchError} = state
  if (status === REJECTED) {
    //   return (
    //     <div role="alert">
    //       There was an error:{' '}
    //       <pre style={{whiteSpace: 'normal'}}>{fetchError.message}</pre>
    //     </div>
    //   )

    // we want to create/render above, but by throwing an error instead
    // the UI (for this status) shall be rendered from an error boundary function

    console.log(
      `..throwing fetchError ${fetchError} because status REJECTED: ${status}`,
    )
    throw fetchError
    // fetchError is already in the format of ERROR object. If it was not, would
    // 	need to pass message into ERROR function and have it create
    //  error.message, etc

    // throw new Error(`REJECTED, state: ${state}, pokemonName: ${pokemonName}`)
    // I *think* throwing a new Error creates an infinite loop. TODO: verify
  } else if (status === IDLE) {
    return 'Submit a pokeman'
  } else if (status === PENDING) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === RESOLVED) {
    return <PokemonDataView pokemon={pokemon} />
  } else {
    throw new Error(
      `This line of code should never be reached.
		\t Unknown Status: ${state}, ${pokemonName}.`,
    )
  }
}

function ErrorFallbackUI({error, pokemonName}) {
  // This is the UI rendered as a fallback UI, during errorBoundary condition

  // REM error must be destructured from props !!! props is the argument/value
  //	passed in, NOT error!  props -> props.error OR {error} as incomming argument!

  // console.log('fallback error UI', error.message, error)

  return (
    <div role="alert">
      There was an error:{' '}
      {<pre style={{whiteSpace: 'normal'}}>{error.message}</pre>}{' '}
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  /* NOTICE: ErrorFallbackComponent has 1st letter CAPITALIZED because it
		represents a COMPONENT (as a variable I am not positive this is REQUIRED for
			it to work in React as expected, maybe it is, certainily it is at least a
			convention, which I appreciate)
	 */
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          ErrorFallbackComponent={ErrorFallbackUI}
          pokemonName={pokemonName}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

// eslint-disable-next-line no-unused-vars
function wrapNotesForEasyCodeFolding() {
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

			06.extra-4: Error Boundary notes

				See comments in code for additional notes RE: ErrorBoundary components

					Notice how componentDidCatch() runs AFTER getDerivedStateFromError(error)
						which makes it fine for external logging services, while
						getDerivedStateFromError(error) is appropriate for setting state,
						(and that state is used to trigger the errorBoundary UI to render the
						error UI)

					Remember:
						- getDerivedStateFromError(error) TAKES IN THE THROWN ERROR (and
							error.message contains the MESSAGE that the error was thrown with)
						- use that passed in `error` to set some state that is also used to
							tell its component to render the error UI.
						- must update errorBoundary state like below:
								componentDidCatch(error) {
									//...do stuff in function if necessary...
										return ( {error} )
										// or maybe return {hasError: true, message: error.message}
										// depending on how want to write the render function
								}
							aka above internally does the following:
									this.setState({error})
						- If there is NO error in the wrapped components, this errorBoundary
							component MUST render its children!!:
								return {this.props.children}



			06.extra-3 COMMENTS and setState order within useEffect
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
}
