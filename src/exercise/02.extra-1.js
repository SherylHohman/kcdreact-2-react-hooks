// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  /*Previous couple commits have examples of 4 different ways to
        write the code to use lazy initialization with useState
        plus 2 ways that do NOT use lazy initialization, which can be expensive.
    Has Experimental code that is good for
    LEARNING, Comparing and Contrasting only.
  */

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

  /*
  // Do NOT do this. It is expensive NOT lazy initialization.
  // It unnecessarily reads the Storage at every render.
  // It should only read it at page reload (Component Mount)

  const initialName_EXPENSIVE =
    window.localStorage.getItem('name') ?? initialName
  const [name_EXPENSIVE, setName_EXPENSIVE] = React.useState(initialName)
  */

  // 4
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name4') ?? initialName,
  )

  // BAD: do NOT call Storage.setItem() directly!
  //    must use useEffect, because Storage.setItem() has sideEffects.
  // GOOD: useEffect callback
  React.useEffect(() => window.localStorage.setItem('name', name))

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
