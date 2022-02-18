// useState: tic tac toe
// 💯 (alternate) migrate from classes
// http://localhost:3000/isolated/exercise/04-classes.js

import * as React from 'react'

// If you'd rather practice refactoring a class component to a function
// component with hooks, then go ahead and do this exercise.

// 🦉 You've learned all the hooks you need to know to refactor this Board
// component to hooks. So, let's make it happen!

// class Board extends React.Component {
function Board() {
  // state = {
  //   squares:
  //     JSON.parse(window.localStorage.getItem('squares')) || Array(9).fill(null),
  // }
  const [squares, setSquares] = React.useState(
    () =>
      JSON.parse(window.localStorage.getItem('squares')) || Array(9).fill(null),
  )

  // selectSquare(square) {
  function selectSquare(square) {
    // const {squares} = this.state
    const nextValue = calculateNextValue(squares)
    if (calculateWinner(squares) || squares[square]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    // this.setState({squares: squaresCopy})
    setSquares(squaresCopy)
  }
  // renderSquare = i => (
  /* function renderSquare(i) {
       return (
    // can do it this way (func), but BETTER to do below  (const)instead:
  */
  const renderSquare = i => (
    /* <button className="square" onClick={() => this.selectSquare(i)}> */
    <button className="square" onClick={() => selectSquare(i)}>
      {/* {this.state.squares[i]} */}
      {squares[i]}
    </button>
  )
  // }

  // restart = () => {
  /*function restart() {  // can do this, but better to use const, as below: */
  const restart = () => {
    // this.setState({squares: Array(9).fill(null)})
    const newSquares = Array(9).fill(null)
    // this.updateLocalStorage()
    setSquares(newSquares)
  }

  // componentDidMount() {
  //   this.updateLocalStorage()
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.squares !== this.state.squares) {
  //     this.updateLocalStorage()
  //   }
  // }

  // updateLocalStorage() {
  // window.localStorage.setItem('squares', JSON.stringify(this.squares))
  // }

  /* Normally, this will be moved to the top of the function component
     I only left it here to show that it is replacing the above code
     Notice that the updateLocalStorage function was needed, only to avoid
     duplicating code, as both lifecycle methods had to practically the same thing.
     Now (with useState) we are no longer in a duplicate code situation, so can
     can simply write it directly inside useEffect.
  */
  React.useEffect(() => {
    window.localStorage.setItem('squares', JSON.stringify(squares))
  }, [squares])

  // render() {
  // const {squares} = this.state
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  let status = calculateStatus(winner, squares, nextValue)

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {/* {this.renderSquare(0)}
          {this.renderSquare(1)}
    {this.renderSquare(2)} */}
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {/* {this.renderSquare(3)}
          {this.renderSquare(4)}
    {this.renderSquare(5)} */}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {/* {this.renderSquare(6)}
          {this.renderSquare(7)}
    {this.renderSquare(8)} */}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {/* <button className="restart" onClick={this.restart}> */}
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
  // }
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App

/* SH NOTES: Insight, Felt Experience Gained from doing this refactor,
    even though I knew the refactor itself would be easy.
    Seeing how the code changed was a good exercise.

  Interesting how useEffect() means we do not need to manage any calls to
  `updateLocalStorage()` function. It just happens automatically. With classes we
  had to call this function whenever we changed (relevant) state - WE had to
  manually manage it, manually call the function.

  With useEffect, only available in functional components, we write the useEffect
  function, but then React manages when it needs to be called. True, we give it
  the dependancy array. But we never have to physically call (it or any other). No
  matter how many more places we decide to add code that changes (relevant) state,
  we never have to think to _also_ call that side effect code. It (useEffect) is
  declarative code, and React handles the details of maintaining (calling) that
  function (code) when necessary. Quite neat.

  Had I not done this exercise I would never have experienced this insight.

  Of course, the other great thing is not needing to do componentDidMount, and
  componentDidUpdate.
  Which I already knew about. But in doing the refactor I could see a little bit
  how much coding overhead/thought process, and sort-of (but not really)
  duplicated code, and code management useState takes care of. It is actually a
  little bit less to think about when writing components.

  Part of the reason it is good we do not need to use component LifeCycle methods,
  is that often code used in (DidMount, DidUpdate) is duplicate code!
  Also ..DidUpdate, we often *manually* need to compare old and new state values,
  *then* decide if we should run our code, and how to update it. (REM in class
    components, state gets *merged*, with function/useState, it is replaced, but
    only a specific useState variables are being changed, not an entire, single
    state object)
  useEffect also manages when its side effects are even called.

  All-in-all, there is less hand-holding management of state overall when using
  hooks. I still like class based components, but I am beginning to perhaps
  prefer, or at least see some benefits hooks/functional components provide. They
  are a little bit messier to read without encapsulation, and even because the
  lack of a `this` keyword. It might be more difficult to keep track of the origin
  of some variables?? But maybe it just seemed that way as I was first introduced
  the them. Time will tell. Obviously, though, hooks are the future. And I am now
  more fine with that.

  Update: good point is made in the solution video: I properly added lazy
    initialization with useState when I refactored from the class this.state={}
    initialization. But it is good to point out that "lazy initialization" was not
    needed in the class based component, because by definition setting state *is*
    a "lazy initializer" - state ={...} is run only once: during class construction.
    The difference with classes
    is that that state initialization in classes is only done once, during the
    constructor phase, so it is a "lazy initializaer", so to speak, by definition.
    In contrast, useState is run at every render. While the value passed to useState
    is only assigned to the state value once, during "construction", any executable
    code inside the () which invokes the function call is run each time, to
    determine the value of the arguments passed into useState.
    So to make any function that is used to determine useState's initial value
    to be run only once, it must be passed to the useState wrapped
    inside an anon function as a callback. The callback *is* run only once. But
    remember, an invoked "inline" function is executed before setState is "called",
    with the result passed in as the argument to useState (which then promptly
    discards that result when called during re-render.) A callback function would
    only be invoked by useState at first render (aka initialization). This can
    happen because useState accepts either a value or a function as its argument.
    If a function, it invokes the given function and initializes the state with
    the resulting value, otherwise just assigns the given value.



*/
