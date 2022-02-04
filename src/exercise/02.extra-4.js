// useEffect: persistent state
// 💯 flexible localStorage hook
// http://localhost:3000/isolated/exercise/02.extra-4.js

import * as React from 'react'

// 4. 💯 flexible localStorage hook

// Take your custom useLocalStorageState hook and make it generic enough to
// support any data type (remember, you have to serialize objects to strings…
//     use JSON.stringify and JSON.parse). Go wild with this!

function useLocalStorageState(keyName, defaultValue = '') {
  // keyName will always be coerced into a string. Even if it is undefined or null.
  //    and '' is also an allowed keyName on the local Storage object.
  //
  // lazy initialization from value in storage, (if exists)
  const [keyValue, setKeyValue] = React.useState(
    () => window.localStorage.getItem(keyName) ?? defaultValue,
    //  Official Solution:
    // () => window.localStorage.getItem(keyName) || defaultValue,
  )

  // update Storage when its value changes
  React.useEffect(() => {
    window.localStorage.setItem(keyName, keyValue)
  }, [keyName, keyValue])

  return [keyValue, setKeyValue]
}

function Greeting({initialName = ''}) {
  //  This custom hook replaces the useState and useEffect to keep state
  //    in synch with localStorage to provide persistent data

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
