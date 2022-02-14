// useState: tic tac toe
// 💯 preserve state in localStorage
// http://localhost:3000/isolated/exercise/04.extra-1.js

// 04.extra-1 : Preserve State in Local Storage
//  1. 💯 preserve state in localStorage

//👨‍💼 Our customers want to be able to pause a game, close the tab, and then
//  resume the game later. Can you store the game’s state in localStorage?

import * as React from 'react'

function Board() {
  const SAVED_GAME = 'TicTacToe'
  const emptySquares = Array(9).fill(null)

  const [squares, setSquares] = React.useState(() => {
    return JSON.parse(window.localStorage.getItem(SAVED_GAME)) ?? emptySquares
  })

  React.useEffect(() => {
    window.localStorage.setItem(SAVED_GAME, JSON.stringify(squares))
    return // (no cleanup function to return)
  }, [squares])

  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (winner || squares[square]) {
      return // early exit, no state change
    }
    // 🦉 REM: do NOT mutate or directly change state in React.
    let newSquares = [...squares]
    newSquares[square] = nextValue
    setSquares(newSquares)
  }

  function restart() {
    setSquares(emptySquares)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
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
  // squares.every(Boolean)
  // === squares.every( (item) => Boolean(item))
  // It is a short-hand for pass-through parameters:
  //    takes the item argument, passes it in to Boolean() with the same argument,
  //    to coerce it (item) into truthy or falsey value, which it returns.
  //    if all these arguments are true, every returns true. A single false causes
  //    "every" to return false
  // so...if every square is true (has an X or O string) then true, else false
  // https://michaeluloth.com/filter-boolean
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  // https://michaeluloth.com/filter-boolean
  // filter(Boolean) filters out falsey objects. In this case null's.
  // So filter.length has, hence counts, only X and O strings.
  // X ALWAYS goes first. So if length is even, it is X's turn.
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
