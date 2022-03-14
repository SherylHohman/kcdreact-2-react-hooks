// useEffect: HTTP requests
// 💯 use react-error-boundary
// http://localhost:3000/isolated/exercise/06.extra-6.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

// SH fetch states
const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

/* SH Replacing manual ErrorBoundary with the library

class ErrorBoundary extends React.Component {
  //  ** since setting state is the only thing we are using constructor for, we
  //	can let React implicitly create the constructor function for us, and
  //	instead just create the state variable,

  state = {error: null}

  static getDerivedStateFromError(error) {
    return {error}
  }

  render(props) {
    const {error} = this.state
    const {pokemonName} = this.props

    if (error) {
      return (
        <this.props.ErrorFallbackComponent
          error={error}
          pokemonName={pokemonName}
        />
      )
    }

    return this.props.children
  }
}
*/

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: IDLE,
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return // no cleanup function needed
    }

    setState({status: PENDING})

    // method 2: use then(success, failure) only because setState is gauranteed
    //	to NOT ever throw an Error.
    //	If it could, we'd be better to use method 1: .then, .catch
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon, status: RESOLVED})
      },
      error => {
        setState({error, status: REJECTED})
      },
    )

    return // no cleanup function needed
  }, [pokemonName])
  // do not included `state` in dependancy array! else: Endless re-renders.
  // It is ONLY if/when have console.logs that print `state` is even in this function!

  // RENDER
  console.log('RENDERING state:', state)

  const {status, pokemon, error} = state
  if (status === REJECTED) {
    // Handle this status with an ErrorBoundary
    // state.error is already in the format of an ERROR object.
    throw error
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

// When used with the library react-error-boundary, it is passed the following props:
//		error,
//		resetErrorBoundary: a callback that is called by the library just before
//			it tries re-rendering/ Use this to reset state.
//		This is whatever functions were passed to onResetKeysChange and/or onReset
//			props

/* function ErrorFallbackUI({error, pokemonName, ...otherProps}) {
		(previous, home grown version above, below is API for library version)
	*/

function ErrorFallbackUI({error, resetErrorBoundary}) {
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

  // TODO:
  //	This exercise will use npm package:
  //		 	react-error-boundary
  //		 	https://github.com/bvaughn/react-error-boundary
  // 	to recover from an error boundary fallback UI.
  // 	This is easier to maintain than relying a specific key property update,
  // 	or some other mechanism, to reset an boundary state, and allow the
  // 	app to recover, and once again render the children, if the bad data
  // 	can be fixed.

  /* extra-5: PREVIOUS VERSION OF THE APP, via a HOMEGROWN ErrorBoundary Component:
			WOW, just adding key prop to ErrorBoundary, lets it remount, thus resetting
			its state when the pokemonName changes!
			Thus, this allows for error RECOVERY, once user UPDATES pokemonName
				to a valid value! (well, anytime its value changes, ErrorBoundary component
				remounts/resets! - and either a new error, or fixed component results.)
			Since the pokemonName input is still a working component, not affected by
				the ErrorBoundary, as it is not a child of the errorBoundary component!,
				pokemonName can update, thus trigger remount of the ErrorBoundary component.
	*/

  // ErrorBoundary API from library uses the props:
  // 		FallbackComponent: the function that renders the errored UI replacement.
  //		onError: error logging or side effects, ~ React.ComponentDidCatch()
  //		resetkeys: array of values the component has access to...
  //			Performs similar function that our key prop did in the extra-5 version
  //		  From docs:
  //				Sometimes an error happens as a result of local state to the
  //				component that's rendering the error.
  //				[SH: in this case we can add the local state to the resetKeys array]
  //
  //				...the resetKeys prop which is an array of [values] ...
  //				the ErrorBoundary ...[will] check [at] each render
  //				(if there's currently an error state).
  //				If any of those elements [values] change between renders, then the
  //				ErrorBoundary will reset the state ...[, and that] will
  //				[cause the children to] re-render ...
  //			SH NOTE: pokemonName works here because it is changed from an element
  //				NOT wrapped by the ErrorBoundary, AND still visible on screen when
  //				the FallbackComponent is rendered.
  //				So, all the user needs to do is input a valid pokemonName,
  //					and all we need to do is put `pokemonName` in the the resetKeys array.
  //				Otherwise, would (likely?) need to assign the API's `onReset` prop
  //				 to a function that will update the value that caused the error to
  //				 a "safe", error-free value, then manually reset the error state
  //				 variable.
  //		onResetKeys: use this in conjunction with resetKeys if needed.
  //			If provided, it is called after resetKeys.
  //			It's called with the arguments: prevResetKeys and resetKeys
  //			It and can be used for additional data processing, giving access to
  //				aforementioned the passed in data/arguments/values/state.
  //		onReset: If the data that caused the error can only be accessed/updated
  //			from within the ErrorBoundary itself (eg, if our pokemonName input box
  //			was not accessible while the ErrorFallbackUI was triggered, or if the
  //			piece of data only existed within an ErrorBoundary child, `resetKeys`
  //			would not be able to automatically reset the errorBoundary for us.
  //			In this case we must provide a function to manually change the troubled
  //			data, and reset the error state. Assign that function to the
  //			ErrorBoundary's `onReset` prop. In the docs, (confusingly) the function
  //			that one assignes to the onReset prop is known as `resetErrorBoundary`)

  function resetErrorBoundary(
    nameOfPropBeingExecuted = '',
    pokemonName = null,
  ) {
    // function resetErrorBoundary(someArgumentA, someArgumentB) {
    // someArgumentA & someArgumentB are standing in for any number of arguments
    //		that I can choose to call this function with. Can also be empty.
    // Use this function to manually change the value of a variable that triggered
    //	the thrown error.
    //	For example, if the input box that was used to set the
    //	pokemonName was not visible on screen when the ErrorBoundary UI was
    //	rendered, I could put a button inside the fallbackUI that the user could
    //	click. The onClick for that button could be assigned to this function.
    //	This function could set pokemonName to a valid value, such as ''.
    //	Used in conjunction with resetKeys={[pokemonName]}, now that pokemonName
    //	has been updated, the ErrorBoundary error state would be reset, thus
    //	recovery!

    //  This function is also necessary if the value that needs to be "fixed"
    //	is dependant on values only accessible to children of the ErrorBoundary.
    //	Eg. If we need access to someArgumentA and someArgumentB, that do not
    //	outside the ErrorBoundary component. ie, these values are owned by the
    //	child that threw the error.

    // NOTE: Important: onReset will NOT be called when reset happens from a
    //		change in resetKeys. Use onResetKeysChange for that.

    console.log(
      'BECAUSE in this app, pokemonName is reset by a component OUTSIDE the ErrorBoundary,',
      '\t the ErrorBoundary was reset automatically via resetKeys !! (see docs)!',
      '\t Hence onReset is never Called..,',
      '\t instead onResetKeysChange had to be used to print this log.',
      '\t as a side effect.',
    )
    console.log(
      'nameOfPropBeingExecuted:',
      nameOfPropBeingExecuted,
      'pokemonName:',
      pokemonName,
    )
    return // do nothing. This is purposely an empty DoNothing function.
    // it is only here for educational purposes.
  }

  // remember: resetKeys must be passed an ARRAY. REMEMBER THE [] !

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* <ErrorBoundary
          key={pokemonName}
          ErrorFallbackComponent={ErrorFallbackUI}
          pokemonName={pokemonName}
        > */}

        {/* NOTE: onResetKeysChange AND onReset are NOT NEEDED for THIS app */}
        <ErrorBoundary
          FallbackComponent={ErrorFallbackUI}
          resetKeys={[pokemonName]}
          onResetKeysChange={() =>
            resetErrorBoundary('onResetKeysChange', pokemonName)
          }
          onReset={() => resetErrorBoundary('onReset', pokemonName)}
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
  //
  /*	06.extra-6 instructions 6. 💯 use react-error-boundary (npm package)
				[Production deploy](https://react-hooks.netlify.app/isolated/final/06.extra-6.js)

				As cool as our own ErrorBoundary is, I’d rather not have to maintain it
				in the long-term. Luckily for us, there’s an npm package we can use
				instead and it’s already installed into this project.
				It’s called :

						react-error-boundary
						https://github.com/bvaughn/react-error-boundary

				Go ahead and give that a look and swap out our own ErrorBoundary for the
				one from react-error-boundary.
	*/
  //
  /*	06.extra-5 instructions 5. 💯 re-mount the error boundary

			[Production deploy](https://react-hooks.netlify.app/isolated/final/06.extra-5.js)

			You might notice that with the changes we've added, we now cannot recover
			from an error. For example:

			1. Type an incorrect pokemon
			2. Notice the error
			3. Type a correct pokemon
			4. Notice it doesn't show that new pokemon's information

			The reason this is happening is because the `error` that's stored in the
			internal state of the `ErrorBoundary` component isn't getting reset, so
			it's not rendering the `children` we're passing to it.

			So what we need to do is reset the ErrorBoundary's `error` state to `null`
			so it will re-render. But how do we access the internal state of our
			`ErrorBoundary` to reset it? Well, there are a few ways we could do this
			by modifying the `ErrorBoundary`, but one thing you can do when you want
			to _reset_ the state of a component, is by providing it a `key` prop which
			can be used to unmount and re-mount a component.

			The `key` you can use? Try the `pokemonName`!
	*/
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
  //
  /*  SH Notes:

			06.extra-6: react-error-boundary library Notes:
				TLDR:

					The ErrorBoundary library API still requires the error boundary fallback
						ui to be assigned to the `FallbackComponent` prop. This happens to be
						the same property name I used in my HOMEGROWN version of the
						ErrorBoundary component.
						So THAT line does NOT Change.

					Basically the only things that DO change, is to replace the keys prop
						`keys={pokemonName}` on my HOMEGROWN ErrorBoundary component,
					with
						`resetKeys={[pokemonName]}` (REMEMBER the []) on the library version.

					AND change paramaters accepted by the ErrorFallbackUI function
					to
						function ErrorFallbackUI({error, resetErrorBoundary}) {...}
					from
						function ErrorFallbackUI({error, pokemonName, ...otherProps}) {...}

					where resetErrorBoundary is whatever function is passed to the
						onResetKeys and/or onReset property.

					I do not pass error or resetErrorBoundary in; the library does it automatically,
						as it automatically calls the ErrorFallbackUI function as needed.

					I am able to use resetKeys property instead of writing an onReset function
						because the user is able to update the offending pokemonName from a
						still visible component that is outside the ErrorBoundary component.
						Thus the error recovery occurs "automatically" (sort of).


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

		  PREVIOUS: NOTE, I was WRONG below! (Explanation in instructions was
					slightly confusing to me! Dunno if it caused the same misunderstanding
					to others, or just to me!)
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
