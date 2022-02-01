// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  // ?? is like ||, except it considers only null and undefined, rather than falsy (ie '' and 0 WILL short-circut evaluate)

  initialName = window.localStorage.getItem('name') ?? initialName
  // Note: above is run at every render.
  // I guess that will be addressed in an extra-credit??
  // Ideally,
  // We want to do this at time of mount only.
  //   like data fetching

  const [name, setName] = React.useState(initialName)

  // Above 2 lines are the exact SAME as:
  //
  // const [name, setName] = React.useState(
  //   window.localStorage.getItem('name') ?? initialName
  // )

  //  TBF, the useState call is also, and must be,
  //     run at every render!
  //  BUT we want the call to read ...localStorage.getItem()...
  //    to be run ONCE (at/per componnent mount)

  // Even if I write it as:
  // const [name, setName] = React.useState(
  //   window.localStorage.getItem('name') ?? initialName
  // )

  // it is EXACTLY THE SAME.
  //    The CALL to window.localStorage.getItem()...
  //    is exectued at EVERY RENDER.
  //  Perhaps?? ()=>{window.localStorage.getItem()...}
  //    does the trick??
  //  If not, I suppose I'll learn soon the PROPER way to address the issue.
  //  If so, I need to gain a better, immediate deep, visceral UNDERSTANDING of
  //    that. (Not just a wrote pattern that I blindly mimic)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  // I guess we are using localStorage as our state manager??
  /* window.localStorage.setItem('name', name) */
  // Above is WRONG. It creates side effects.
  // I guess, that storage could become "stale" ?? not sure
  // I do not have a good feel why this creates a bad side effect.
  // I mean, it is more obvious when data in the component is changed.
  //  But this is outside the component, though it is supposed
  //  to stay in SYNCH with the component!
  // Anyway, it is proper to use useEffect here!:

  // Maybe look it as comparable to controlled inputs.
  //   where the value prop is set equal to the state variable
  //   in order to keep DOM synched with react state var,
  //   and so React component / state is in charge of that value.
  //   Is that a fair mental model??

  // FYI, the Tests PASSED when I did NOT use useEffect.
  //    when I set localStorage DIRECTLY, see commented out code above!
  //    Should the tests be modified to require useEFFECT ??!!
  //    to avoid the side effects that they say is bad.
  //    I mean useEffect is the POINT of this exercise.
  //    (TBF, I think it should be a separate exercise,
  //           AFTER localStorage pre-exercise.)

  // BAD:  window.localStorage.setItem('name', name)
  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  })

  // useEffect is like componentDidMount, componentDidUpdate, AND componentWillUnmount
  //  ("Effects", useEffects happen AFTER RENDER, for purposeful side effects)
  //   https://reactjs.org/docs/hooks-effect.html/
  //  BTW, docs for useEffect is lacking!! does not explain how/when/why very well.
  //    I mean it kind of shows (though document title TO ME is a terrible example.
  //    it is something I never do and have no feel for.)
  //    I am not sure what I feel like is missing from this doc,
  //    but something is left unsettling, unclear, some void.
  //    Some lingering question I cannot quite put my finger on.
  //    Though on its face, it seems to cover the basics.
  //    Just does not click fully though. Does not bridge the gap.
  //  Neither does THIS exercise!
  //    Afterall, I fully "completed" this exercise, passed all the tests.
  //    Moved on. Without even realizing that I did not, in fact, use
  //    `useEffect`, like I was supposed to!.
  //    I guess the "side effect" here is too esoteric for me to relate to
  //      as being a problem.
  //      Also, in fact, it did NOT create a problem!
  //      And any potential problems are not apparent.
  //      PLEASE SHOW ME HOW *NOT* using `useEffect` here *could* create a problem,
  //      issue, or bug!! Help Me SEE, Relate, Get this issue!
  //    Or use a more obvious example, such as data fetching.
  //      I mean, reading from Storage, *is* "data-fetching"..
  //    I dunno. Show an example of how not using useEffect(), can make this thing
  //      go awry. Let me see the BAD side effects of side effects.
  //      This would also help me SEE that updating the Storage
  //      *IS* a SIDE EFFECT.
  //      I dunno why, but it is not clicking *clearly* enough *for me* that this
  //      is a side effect.
  //      And not SEEING, RELATING, to the issues it causes is not helping.
  //      Let me SEE how it could go all wrong. THEN I'll "Get It" clearly.
  //      Viscerally, even.
  //      HELP!@!@  I need this, so it'll stick. And I'll always know WHEN the
  //      code I want to run IS subject! So, I'll unfailingly always use
  //      useEffect() whenever applicable. And use it properly, always.
  //
  //    Additionally, I do not fully see/understand why have to use
  //      React.useEffect( () => { return <function call> })
  //    Instead of just directly calling the funcion:
  //      React.useEffect( <function call> )
  //    I *kind* of "justify" "see it", when forced.
  //      but not really. I just kind of nod & decide to mimic the pattern.
  //      IF I remember that I'm supposed to.
  //      I mean, it'll probably just take practice to make it wrote muscle memeory.
  //      But I'd rathe rhave clear visceral UNDERSTANDING and deep knowledge,
  //      such that the though to do otherwise would be a logical oxymoron, and
  //      be incoceviable, because I understand and "get it" so deeply.
  //      Part of that may just be practice. Yet...
  //

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
