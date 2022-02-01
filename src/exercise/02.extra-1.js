// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage

  // ----

  // 02. Extra-Credit-1
  //   💯 lazy state initialization

  //   Right now, every time our component function is run,
  //      our function reads from localStorage.
  //      This is problematic because it could be a performance bottleneck
  //      (reading from localStorage can be slow). And what’s more
  //      we only actually need to know the value from localStorage
  //      the first time this component is rendered!
  //      So the additional reads are wasted effort.

  //   To avoid this problem, React’s useState hook allows you to
  //    pass a function instead of the actual value, and then it will
  //    only call that function to get the state value when the component is
  //    rendered the first time.
  //    So you can go from this:
  //        React.useState(someExpensiveComputation())
  //    To this:
  //        React.useState(() => someExpensiveComputation())

  //   And the someExpensiveComputation function will only be called when it’s needed!

  //   Make the React.useState call use lazy initialization to
  //        avoid a performance bottleneck of reading into localStorage on every render.

  //   Learn more about lazy state initialization:
  //        https://kentcdodds.com/blog/use-state-lazy-initialization-and-function-updates

  //
  // ----
  //

  // SH Note: below 2 LINES are run at every render.
  // I guess that will be addressed in an extra-credit??
  // Ideally,
  // We want to read from Storage at time of mount only.
  //   like data fetching
  //  TBF, the useState call is also, and must be,
  //     run at every render, too!
  //  BUT we want the call to read ...localStorage.getItem()...
  //    to be run ONCE (at/per componnent mount)

  /* initialName = window.localStorage.getItem('name') ?? initialName
  const [name, setName] = React.useState(initialName)
  */

  // Even re-written as:
  const [name, setName] = React.useState(
    window.localStorage.getItem('name') ?? initialName,
  )
  // it is EXACTLY THE SAME.
  //    The CALL to window.localStorage.getItem()...
  //    is exectued at EVERY RENDER.
  //  Perhaps?? ()=>{window.localStorage.getItem()...}
  //    does the trick??
  //  If not, I suppose I'll learn soon the PROPER way to address the issue.
  //  If so, I need to gain a better, immediate deep, visceral UNDERSTANDING of
  //    that. (Not just a wrote pattern that I blindly mimic)

  // Above 2 lines are the exact SAME as:
  //
  // const [name, setName] = React.useState(
  //   window.localStorage.getItem('name') ?? initialName
  // )
  //

  /* window.localStorage.setItem('name', name) */
  // Above is WRONG. It creates side effects.
  // Maybe look it as comparable to controlled inputs.
  //   where the value prop is set equal to the state variable
  //   in order to keep DOM synched with react state var,
  //   and so React component / state is in charge of that value.
  //   Is that a fair mental model??

  // BAD:  window.localStorage.setItem('name', name)
  // Think of localStorage as data fetching. It is.
  //    AND it is Asynch!! So def. data fetching. It takes time.

  // Rem useEffect is like combo of:
  //    componentDidMount, componentWillUpdate, componentWillUnmount
  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  })

  // useEffect is like componentDidMount, componentDidUpdate, AND componentWillUnmount
  //  ("Effects", useEffects happen AFTER RENDER, for purposeful side effects)
  //   https://reactjs.org/docs/hooks-effect.html/

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
