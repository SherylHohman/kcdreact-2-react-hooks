// useEffect: HTTP requests
// 💯 reset the error boundary
// http://localhost:3000/isolated/exercise/06.extra-7.js

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

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon, status: RESOLVED})
      },
      error => {
        // REM if would need to catch any errors from the RESOLVE param,
        //	would need to use the .then(), .catch() notation instead of this
        //	.then(resolve, error) notation
        setState({error, status: REJECTED})
      },
    )

    return // no cleanup function needed
  }, [pokemonName]) //NEVER include state (even if console.log), else infinite re-renders

  // RENDER PokemonInfo component:
  // console.log('RENDERING state:', state)

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

// Using with the library react-error-boundary.
//	This ErrorFallbackUI function
//	is assigned to their API prop:
//			`FallbackComponent`
//	This FallbackComponent is called whenever an ErrorBoundary wrapped component's
//		UI throws an error.
//	This 'FallbackComponent' is called by the library, and it passes in the
//		following:
//		- error,
//		- resetErrorBoundary
//				a callback that is called by the library just before
//				it tries re-rendering.
//				resetErrorBoundary is whatever function I assign to EB props:
//					- onReset, and/or
//					- onResetKeysChange.
//		  		(depending on whether onReset or onResetKeysChange is triggering
//					the re-render)
//				Use this function to "manually" reset state, or introduce side effects (
//					eg logging, or changing other variables.)
//	I can *also* pass in additional variables AFTER error, resetErrorBoundary,
//		 eg: pokemonName.
//		To do so, the additional variables must appear as arguments to the
//			onReset() / onResetKeysChange() function definitions
//			(the function definitions assigned to those properties)
//			When doing that, those variables must be in scope of the ErrorBoundary
//			component. If need be, add them as props on the ErrorBoundary def/call.
/**/

// function ErrorFallbackUI({error, resetErrorBoundary, setPokemonName}) {
function ErrorFallbackUI({error, resetErrorBoundary}) {
  //  Do NOT need to pass in MY state props. Do not need to call resetErrorBoundary
  //		with the props it needs!. Because onReset() definition includes the
  //		calls my function with the needed props, it already has access,
  //		and the API automatically calls it with the needed props.
  //		So inside THIS function, just call resetErrorBoundary() with no arguments.
  //		And the arguments for this function only needs the API parameters, NO OTHERS.
  //	below is WRONG!!! read note ABOVE!
  // (prev): NOTICE: in order to gain access to setPokemonName (and the un-needed
  //		pokemonName), I must add them them in as props. The EB library ALWAYS
  //		calls this function with error and resetErrorBoundary props.)

  // For this extra credit-7, we want the user to click a button to reset the
  //	error boundary state. , before allowing the user to type in a new pokemonName.

  // resetErrorBoundary is automatically passed in via the API.
  // It is whatever function I assign to the onReset API property.
  console.log(
    'inside ErrorFallback.',
    '\n\t pokemonName type:',
    typeof pokemonName,
    '\n\t setPokemonName type:',
    typeof setPokemonName,
  ) // hint, BOTH are UNDEFINED! they are NOT in scope, and not passed in!

  return (
    <div role="alert">
      <div>There was an error: </div>
      {<pre style={{whiteSpace: 'normal'}}>{error.message}</pre>}{' '}
      <button
        onClick={() => {
          // USE 1 of 3 methods:
          //	1) (recommended!)
          //		 call the resetErrorBoundary() function explicitely,
          //		 passing in any necessary values (eg setPokemonName)
          //		 As above, setPokemonName must be passed in as an argument to
          //			this ErrorBoundaryUI function AND as a prop to the
          //			ErrorBoundary component.

          //		In this case, resetErrorBoundary must run the code to reset state
          //		(same code that would otherwise be directly called in this func
          //		if used method 2):

          // 	resetErrorBoundary(setPokemonName) // NO! NOT like this.
          // 	 call below WITHOUT arguments.
          //	 See note at top of ErrorFallbackUI function.
          //   The function assigned to onReset passes in the required vars.
          //	 This invocation does not.
          resetErrorBoundary()

          // 2) DO NOT DO IT THIS WAY.
          //		Technically can, but better to
          //		use the API to pass in required vars.
          //
          //		How to directly reset necessary state directly in this function:
          //		(setPokemonName must be passed as a prop into this
          //			ErrorBoundaryUI function,
          //		 AND to do that, it must also be sent as a prop on the
          //			ErrorBoundary component.
          //		 THEN can call the function as below
          //		):
          // setPokemonName('')

          // 3) DO NOT DO IT THIS WAY.
          //		Technically can, but better to pass this
          //		function in using the API/prop provided explicitely for this.
          //
          //		How to (not recommended):
          //		directly reset necessary state directly in this function:
          //		(setPokemonName must be passed as a prop into this
          //			ErrorBoundaryUI function,
          //		 AND to do that, it must also be sent as a prop on the
          //			ErrorBoundary component.
          //		 ADDITIONALLY, resetErrorBoundarySH FUNCTION would need
          //			to be passed added as a param to this function
          //		 AND passed in as a prop to the EB component.
          //			which is what onReset prop in the API is already doing for us.
          //
          //		 If do this, we are 1/2 recreating onReset API, but
          //			incompletely leaving off the part where we do not need to
          //			pass the params in.
          //		):
          // resetErrorBoundarySH(setPokemonName)
        }}
      >
        Try again
      </button>
    </div>
  )
}

// rename func to disambiguate my func name from API param name `resetErrorBoundary`
// function resetErrorBoundary(setPokemonName) {
function resetErrorBoundarySH(setPokemonName) {
  // Assign this function to the ErrorBoundary (library) onReset property.
  // Use it to reset the EB state however I see fit.
  //	It gets triggered by custom code inside my ErrorBoundary UI which calls
  //	is set to call the API `onReset`.

  // NOTE: Important: onReset will NOT be called when reset happens from a
  //		change in resetKeys. (ie via some component outside the ErrorBoundary)
  //		If also have an external mechanism that changes a value in `resetKeys`,
  //		Then I would need to Use onResetKeysChange for any side effects.
  //	  In that scenario, those outside components *also* remount.
  //	  That scenario is what we did in the previous exercise 06.extra-6.

  //	After this function runs, if a value in the resetKeys array has changed,
  //	The EB will remount, and if no more errors are throwm, the children will
  //	display instead of the EB UI! vioa! recovery.

  console.log('Inside resetErrorBoundarySH')

  setPokemonName('')

  // Obviously this tiny function is better to write inline in the
  //	ErrorBoundary component call/definition.
  //	But as "document" of my learning, I am recording comments and learning
  //	process in these comments, which are too numerous to write inline!

  return //
  // The library `resetErrorBoundary` API does not use a return value.
  // Can call this function directly from inside
  //		fallbackRenderer or FallbackComponent (function assigned to those props)
  //	OR can set it to onResetKeysChange or onReset props, to have it called
  //	automatically, just before resetting the EB and re-rendering.
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  // ErrorBoundary API from library uses the props:
  // 		FallbackComponent:
  //				the function that renders the errored UI replacement.
  //		(or fallbackRenderer to do same, but inlined)
  //		onError:
  //				error logging or side effects, ~ React.ComponentDidCatch()
  //		resetkeys:
  //				array of vars to see if changed, if so reset the ErrorBoundary state.
  //		onResetKeysChange:
  //				if need side effects, or *anything* else to happen when
  //				onResetKeys (automatically) reesets the ErrorBoundary, causing a
  //				re-render. Anything we want to control/change/happen when it re-renders
  //				Any recovery side effect.
  //				eg. change additional state values, or other variables.
  //				or for logging. This is the only mechanism avail to
  //		onReset:
  //				if need to provide a function to manually reset the variable
  //				responsible for triggering the ErrorBoundaryFallbackUI.
  //				?Use in conjunction with onResetKeys? I THINK onResetKeys will
  //				be auto called after, if it successfully changed a listed key.
  // 				remember: resetKeys must be passed an ARRAY. REMEMBER THE [] !

  /* resetKeys: ONLY needed if want the the user to be able to "reset"
			automatically via the input box. If do NOT add this prop, then
			entering new info inside the input box (or clicking on link) will update
			the value in the info box BUT will NOT reset the ErrorBoundary, ie the
			PokemonInfo will still show the error message, instead of the pokemon info.

			If DO include it, then the user is NOT REQUIRED to click the button
			inside the ErrorBoundaryUI, in order to reset the error boundary, and
			remount the component. User can ignore the button, and simply enter a
			new Pokemon Name.

		onReset and resetErrorBoundary are needed only if want the user to be able
			to click on the button in order to reset the component. With this option,
			only the ErrorBoundary and below is re-rendered or remounted.
			The Pokemon Name input box ?? etc is NOT remounted ????
			(not sure this is correct, but something to do with flashing 'enter pokemon'
			is avoided. Clearly, I still do not know what Dodds was talking about, and
			there is something I do not yet understand on that front.)

		Note: that to get access to pokemonName and setPokemonName
				(this app only needs the latter, but the former was a good proxy for
				seeing if the vars I needed access to were being passed in or not.
				This was a thing I had a difficulty figuring out / getting right!!),
			I need to pass them in as written
			- in the onReset callback
			OR if NOT using onReset, then I could call my resetErrorBoundary function
				(I should give it a different name so as to disambiguate it from the prop
					name, (even though I assign mine to theirs)
				)
				from inside my ErrorFallbackUI component, but
				ONLY IF ALSO pass in setPokemonName and pokemonName props ON the
					ErrorBoundary component itself.
				AND destructure them in the ErrorFallbackUI function definition!!
			DO NOT DO BOTH!
			(I have BOTH methods implemented currently, for illustrative purposes
				mostly because both of these methods had escaped me earlier.
				It is good to understand both methods. To see how it would be written.
				TBH, I think onReset is cleaner, and would be the most common method.
				In fact the 2nd more popular/cleaner method might to use fallbackRenderer
				before adding those the props directly on the eB component, and then also
				destricturing them within the ErrorFallbackUI, and also calling the
				resetErrorBoundary function within the ErrorFallbackUI function.
				Experience will tell.
				)
	*/

  // INTERESTING. Both the components re-render when only 1 has been reset.
  //		but obviously, the non-reset component, still re-renders with the
  //		SAME error boundary message, because its state was NOT changed/reset.
  //		We see this, because a console.log for both gets printed.
  //	Clarification: when RESET an EB, only THAT component gets re-rendered.
  //		But after that, when then update PokemonName via the input box/lind
  //		THEN both EB components are re-rendered.
  //	  But obvs only the reset component displays the children, pokemon Info
  //		The non-reset component re-renders the SAME bad error message.
  //		Even if the new pokemonName is also invalid,
  //		The reset component displays the new (bad) name,
  //		The non-reset component still displays its same orig (bad) name.

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      Using FallbackComponent:
      <br />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallbackUI}
          onReset={() => resetErrorBoundarySH(setPokemonName)}
          /* resetKeys={[pokemonName]} */
        >
          {/* MOVE THIS BACK INTO ABOVE AS EB PROP
					    SO THAT UPDATING pokemonName ourside the EB (eg input box or link)
							WILL AUTO RESET this EB & remount with the new value
					resetKeys={[pokemonName]}
					*/}
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
      <hr />
      Using fallbackRender:
      <br />
      {/* MOVE THIS BACK INTO BELOW AS EB PROP
				onReset={() => resetErrorBoundarySH(setPokemonName)}
					FOR 3) (below) to work!!
					BUT CANNOT have it present for 1) or 2) below to work!!
			*/}
      {/* Move This back into Below as EB prop
						SO THAT UPDATING pokemonName ourside the EB (eg input box or link)
						WILL AUTO RESET this EB & remount with the new value
				resetKeys={[pokemonName]}
			*/}
      <div className="pokemon-info">
        <ErrorBoundary
          /* resetKeys={[pokemonName]}  */
          /* onReset={() => resetErrorBoundarySH(setPokemonName)} */
          fallbackRender={({error, resetErrorBoundary}) => {
            // NO NEED to ALSO pass in setPokemonName (API allows above only)
            // AND do not need to: setPokemonName is
            // ALREADY IN SCOPE when written inline here.
            // ...as demonstrated via the console.log below
            console.log(
              'using "fallbackRender" prop for the UI',
              '\n\t pokemonName:',
              pokemonName,
              '\n\t setPokemonName type:',
              typeof setPokemonName,
            )

            return (
              <div role="alert">
                <div>There was an error: </div>
                {<pre style={{whiteSpace: 'normal'}}>{error.message}</pre>}{' '}
                <button
                  onClick={() => {
                    // Do 1 of 3:
                    //
                    // 1)
                    setPokemonName('')
                    resetErrorBoundary()
                    //		AH HAA! must *also* call call resetErrorBoundary()
                    //		 after reset state (in this case via: setPokemonName(''))
                    //		Even though *I* do not have a custom resetErrorBoundary
                    //		 defined, the API *DOES*
                    //		 (REM: I define a custom resetErrorBoundary by setting
                    //				a custom function to onReset prop,
                    //				and/or (less often) onResetKeysChange prop
                    //			)
                    //		Call resetErrorBoundary() with NO arguments.
                    //		Do this WITHOUT setting onReset to a custom function.
                    //			(normally, if set onReset, it BECOMES/Overrides their
                    //				generic implementation of below. This statement is not
                    //				quite correct!! Just know that when used with fallback/render
                    //				I should NOT assign an "resetErrorBoundary-like function"
                    //				to onReset. I should simply inline whatever *that*
                    //				function *would* do here, and THEN call (their generic API)
                    //				resetErrorBoundary() function without arguments.
                    //			)
                    //			Because the "the custom reset function" I would otherwise
                    //			put inside a function assigned to onReset is embeded
                    //			in this code, (see above line: (eg: setPokemonName(''))
                    //
                    // 2) OR (inefficient, but possible.
                    //			( #1) above is the usual usecase when using the
                    //				fallbackRender prop
                    //				This method may not be seen in the wild is possible.
                    //				Listed here for a more complete understanding of how
                    //				this all works/connects together.
                    //				)
                    //
                    // resetErrorBoundarySH(setPokemonName)
                    // resetErrorBoundary()
                    //
                    //	 Calling my own custom function to reset the state
                    //			(here it is resetErrorboundarySH(WITH-THE-NECESSARY-ARGUMENT)
                    //				DOES NOT WORK _UNLESS_, as in #1) above,
                    //		I ALSO call default resetErrorBoundary() with no arguments!
                    //
                    //	 	Call my defined function (it is defined as a stand alone
                    //			function in this file, so it is within scope)
                    //	 	(note my func name has SH tacked on to the end, to
                    //		differentiate from the API Param name)
                    //	  in this case, onReset param does not need to be defined
                    //
                    // 3) OR (not common)
                    // resetErrorBoundary(setPokemonName)
                    // 	AND WITH
                    // onReset={resetErrorBoundarySH(setPokemonName)}
                    //	prop added to the ErrorBoundary Component.
                    //
                    //	Use the API prop onReset. Set:
                    // 	Note: this is exactly the same as 2) above, but uses the
                    //	API on the EB component,
                    //	and the (conventioned) Param Name used in this
                    //	fallbackRender.
                    //	It is slightly more abstract.
                    //
                    //	NOTE: If using onReset, it is more common to instead use the
                    //	FallbackComponent prop instead.
                    //
                    //  ie either use fallbackRender and inline direct function
                    //	calls or inline exact code to reset the state
                    //
                    //	4) OR (common. do NOT use fallbackRender at all:)
                    //	Use onReset in combination with FallbackComponent
                    //		props in the EB component instead of fallbackRender prop.
                    //	onReset in necessary when using FallbackComponent,
                    //	because FallbackComponent does not send in user props.
                    //  So onReset function will accept those props, and willl
                    //	auto be called via the library, with its req props.
                    //
                  }}
                >
                  Try again
                </button>
              </div>
            )
          }}
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
  /*	06.extra-7 instructions 7. 💯 reset the error boundary

			[Production deploy](https://react-hooks.netlify.app/isolated/final/06.extra-7.js)

			You may have noticed a problem with the way we're resetting the internal
			state of the `ErrorBoundary` using the `key`.
			Unfortunately, we're not only re-mounting the `ErrorBoundary`, we're also
			re-mounting the `PokemonInfo` which results in a flash of the initial
			"Submit a pokemon" state whenever we change our pokemon.

			So let's backtrack on that and instead we'll use `react-error-boundary`'s
			`resetErrorBoundary` function
			(which will be passed to our `ErrorFallback` component)
			to reset the state of the `ErrorBoundary` when the user
			clicks a  "try again" button.

			> 💰 feel free to open up the finished version by clicking the link in the
			> app so you can get an idea of how this is supposed to work.

			Once you have this button wired up, we need to react to this reset of the
			`ErrorBoundary`'s state by resetting our own state so we don't wind up
			triggering the error again. To do this we can use the `onReset` prop of the
			`ErrorBoundary`. In that function we can simply set `setPokemonName` to an
			empty string.
  */
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

			06.extra-7: manually reset ErrorBoundary (library) Notes:

				**READ THE NOTES WITHIN THE CODE,
				       AND the ALT METHODS which are commented out!!

				Note: my solution differs from the stated exercise.
					I have 2 PokemonInfo cards EACH wrapped in its OWN ErrorBondary.
					They must be reset separately.

				I use two different API's. Each EB uses a different EB prop to display
					and to reset its EB state. This is visible in the code.

				It is used as an educational method to demonstrate how the various
					library API's work. I did not find their docs to be clear enough.
					Perhaps my own React/JS understanding was partly to blame!
					Never-the-less, I feel that examining this code, including
					commented-out alternatives clarifies how to properly use these API's
					and contrasts their use cases!

				In this extra-7, I have REMOVED the resetKeys prop (resetKeys={[pokemonName]})
					from the ErrorBoundary component.
					This is so the effects of resetting the EB from within the EB alone
					is clearer. And because this extra-7 was evidentally designed to NOT
					include that functionality.
					(Weird, that it has to be taken out AFTER it already was in use for
					previous extra-credit, but it is actually better for demonstration purposes.)
				Basically, updating pokemonName from input box will not automatically
					reset the EB on its own, The Button inside the EB must be clicked to
					allow the EB to reset. Only after the EB is reset, will a change in the
					input box update the EB UI.
					In the next extra-8, I believe it gets added back in. Probably that is
					the only thin it does. lol.
				In the PREVIOUS extra-6, the entire app was re-rendered, re-mounted.
					In this version, only only re-mounted/non-triggered-EB are re-rendered
					if pokemonName (input box) is updated.
					And, more imporantly, we learn how to use the EB itself
					to remount itself!

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
