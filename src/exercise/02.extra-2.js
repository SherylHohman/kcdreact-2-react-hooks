// useEffect: persistent state
// 💯 effect dependencies
// http://localhost:3000/isolated/exercise/02.extra-2.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // ----
  // 02. Extra-Credit-2
  //   💯 effect dependencies

  // The callback we’re passing to React.useEffect is called after every render
  // of our component (including re-renders).
  // This is exactly what we want because we want to make sure that the
  // name is saved into localStorage whenever it changes,
  // but there are various reasons a component can be re-rendered
  // (for example, when a parent component in the application tree gets re-rendered).

  // Really, we only want localStorage to get updated when the name state actually
  // changes. It doesn’t need to re-run any other time.
  // Luckily for us, React.useEffect allows you to pass a second argument called
  // the "dependency array" which signals to React that your effect callback
  // function should be called when (and only when) those dependencies change.
  // So we can use this to avoid doing unnecessary work!

  // Add a dependencies array for React.useEffect to avoid the callback being
  // called too frequently.

  // ----
  //

  // lazy initialization
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName,
  )

  // BAD: do NOT call Storage.setItem() directly!
  //    // window.localStorage.setItem('name', name)
  //    must use useEffect, because Storage.setItem() has sideEffects
  // GOOD: useEffect callback (with NO return value)

  //  Add dependency array to tell react to not run this function
  //    (ie do NOT update the Storage) on re-renders
  //    *unless* `name` changes. (uses Object.is)
  //    Prevents unnecessary function calls, expensive computations, and even
  //    And (? maybe? even prevents unnecessary renders. ?
  //    For example, if name has not changed,
  //    then this component probably does not even need to be re-rendered
  //    when its parent re-renders.
  //    ?)

  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  }, [name])

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
