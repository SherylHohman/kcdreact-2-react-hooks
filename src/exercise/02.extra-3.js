// useEffect: persistent state
// 💯 custom hook
// http://localhost:3000/isolated/exercise/02.extra-3.js

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
//  exactly what logic do we want to extract and "reuse"?
//  Purpose is unclear. So exercise is unclear.
//
//  TODO: when figure out the goal, consider a PR to clarify the instructions!
//
//  Answer: useState and useEffect logic for reading and setting localStorage
//    values: encapsulate into a custom hook that could be used in any component

//   ----

//  (oh, I did not peek at the solution yet.
//      the docs below and the hook name clued me in
//   )
//  https://reactjs.org/docs/hooks-custom.html

// ----

import * as React from 'react'

function useLocalStorageState(keyName, defaultValue = '') {
  // REM: need to set defaultValue here, in case the consuming Component does not.
  // keyName will always be coerced into a string. Even if it is undefined or null.
  //    and '' is also an allowed keyName on the local Storage object.
  //
  // lazy initialization from value in storage, (if exists)
  const [keyValue, setKeyValue] = React.useState(
    () => window.localStorage.getItem(keyName) ?? defaultValue,

    //  Official Solution:
    // () => window.localStorage.getItem(key) || defaultValue,
    // not sure why, but the official solution uses || instead of ??

    //  UPDATE: Official Solution:
    // () => window.localStorage.getItem(key) ?? defaultValue,

    //  It was a bug. KCD accepted my PR #176 to fix it!
    //  My fix is the same as #164 which fixed the other 02.extra-credit files,
    //  but it had missed this file!
    // I now am a Contributor to CODE category! :-) (PR #177 adds me as a contributor)
  )

  // update Storage when its value changes
  React.useEffect(() => {
    window.localStorage.setItem(keyName, keyValue)
  }, [keyName, keyValue])

  // interestingly, we now have to include `keyValue` in the dependency array
  //    because, even though it would not "change" for any particular instance,
  //    it is now passed in as a variable, instead of being hard-coded.
  return [keyValue, setKeyValue]
}

function Greeting({initialName = ''}) {
  /*
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
  */

  //  This custom hook replaces the useState and useEffect code above
  //   const [name, setName] = useLocalStorageState('name', initialName)

  const [name, setName] = useLocalStorageState('name', initialName)

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
