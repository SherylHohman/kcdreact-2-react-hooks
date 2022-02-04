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
    // () => window.localStorage.getItem(keyName) || defaultValue,

    // not sure why, but the official solution now uses || instead of ??
    //  why is it no longer a concern for keyName to not exist, but before it was?

    // If the storage item does not exist, it returns null.
    //   null will trigger the || and the ??
    // Now, since every setItem coerces the value into a String,
    //   The falsey items undefined and 0 are not possible
    // So the only falsey value remaining is ''
    //  So, ?? vs || matters if we want a different response to '' than to null
    //  Interestingly, even if I change the default value to something truthy
    //   (and call greeting without setting initialValue to anything,
    //    AND rename the keyName, say to 'name-extra3', so 02.js does not
    //    conflict with this page in initiallizing a non-existant Storage key
    //   )
    //  When the stored value is '', falsey, the || does NOT replace
    //  the falsey '' with the defaultValue!! WHY?
    //  Actually there is a weird situation where the input and the storage are out of synch, but..
    //  Both lines work exactly the SAME.
    //  So this lends that it is fine that their solution changed it.
    //  But Why?
    //  But what case *could* there be a difference? And if none,
    //  Why were we concerned with this distinction in 3 previous exercises,
    //    but not THIS one?
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
