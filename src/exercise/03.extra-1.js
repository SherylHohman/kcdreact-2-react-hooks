// Lifting state
// 💯 colocating state
// http://localhost:3000/isolated/exercise/03.extra-1.js

import * as React from 'react'

/* function Name({name, onNameChange}) { */
function Name() {
  const [name, setName] = React.useState('')
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input
        id="name"
        value={name}
        onChange={event => setName(event.target.value)}
      />
    </div>
  )
}

function FavoriteAnimal({animal, onAnimalChange}) {
  return (
    <div>
      <label htmlFor="animal">Favorite Animal: </label>
      <input id="animal" value={animal} onChange={onAnimalChange} />
    </div>
  )
}

/* function Display({name, animal}) { */
function Display({animal}) {
  /* const [animal, setAnimal] = React.useState('') */
  return <div>{`Hey! Your favorite animal is: ${animal}!`}</div>
}

function App() {
  /*
  // State no longer needed up here, push it back down
  const [name, setName] = React.useState('')
  */
  const [animal, setAnimal] = React.useState('')

  return (
    <form>
      {/* <Name name={name} onNameChange={event => setName(event.target.value)} /> */}
      <Name />
      <FavoriteAnimal
        animal={animal}
        onAnimalChange={event => setAnimal(event.target.value)}
      />
      <Display animal={animal} />
    </form>
  )
}

export default App
