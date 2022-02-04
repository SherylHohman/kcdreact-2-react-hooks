// useEffect: persistent state
// 💯 custom hook
// http://localhost:3000/isolated/exercise/02.extra-3.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // ----
  // 03. Extra-Credit-3
  //   3. 💯 custom hook

  //   The best part of hooks is that if you find a bit of logic inside your
  //   component function that you think would be useful elsewhere,
  //   you can put that in another function and call it from
  //   the components that need it (just like regular JavaScript).
  //   These functions you create are called “custom hooks”.

  //   Create a custom hook called useLocalStorageState for reusability of all
  //   this logic.

  // ----
  // INSTRUCTIONS UNCLEAR
  //  "all this logic" ?
  //  exactly what logic do we want to extract and (pretend) reuse?
  //  Purpose is unclear. So exercise is unclear.
  //
  //  TODO: when figure out the goal, consider a PR to clarify the instructions!
  //
  //  Think I need to look at the solution to figure out what they are getting at!
  //    what parts, exactly, do we need to extract.
  //    perhaps a use case, I could deduce the parts that need extracted.
  //    But nothing..
  // ----

  // lazy initialization via callback (here as an anon function def)
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name4') ?? initialName,
  )

  // useEffect for side effects (save item to localStorage)(?prevent stale data?)
  // dependency array for efficiency (only run this function when `name` changes)

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
