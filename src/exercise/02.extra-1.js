// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
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
  // ----
  //

  // 🐨 initialize the state to the value from localStorage

  // SH Note: below 2 LINES are run at every render.
  // We want to read from Storage at time of mount only.
  //   like data fetching
  // Except localStorage.getItem is SYNCHRONOUS, data fetching is Asynchronous!

  //  TBF, the useState call is also, and must be,
  //     run at every render, too!
  //  BUT we want the call to read ...localStorage.getItem()...
  //    to be run ONCE (at/per component mount)

  // Think of localStorage as data fetching. It is.
  //    Except that Storage.getItem()/setItem is Synch!! http calls are Asynch.

  initialName = window.localStorage.getItem('name') ?? initialName

  const [name, setName] = React.useState(initialName)
  // useState is Asynchronous

  // Even re-written as:
  //   const [name, setName] = React.useState(
  //     window.localStorage.getItem('name') ?? initialName,
  //   )

  // it is EXACTLY THE SAME.
  //    The CALL to window.localStorage.getItem()...
  //    is exectued at EVERY RENDER.

  // BAD:  window.localStorage.setItem('name', name)
  // setting this state-like persistent value directly can cause synch errors.
  //  must use useEffect
  //      something, something: dependencies, dependency array, side effects
  //      data synch between re-renders. Trigger render if something changes.
  // Rem useEffect is like combo of:
  //    componentDidMount, componentWillUpdate, componentWillUnmount
  //    and localStorage is like persistent "state".
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
