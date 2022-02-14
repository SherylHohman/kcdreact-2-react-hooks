// useState: tic tac toe
// 💯 add game history feature
// http://localhost:3000/isolated/exercise/04.extra-3.js

// 04.extra-3. 💯 add game history feature

// Open http://localhost:3000/isolated/final/04.extra-3.js and see that this
// 04.extra-3 version supports keeping a history of the game and allows you to
// go backward and forward in time. See if you can implement that!

// NOTE: This extra credit is one of the harder extra credits.
//  Don’t worry if you struggle on it!

// 💰 Tip, in the final example, we store the history of squares in an
//  array of arrays.
//  [[/* step 0 squares */], [/* step 1 squares */], ...etc]
//  so we have two states: history and currentStep.

// 💰 Tip, in the final example, we move the state management from the
//      Board component to the Game component and that helps a bit.
//  Here’s what the JSX returned from the Game component is in the final version:
/*
    return (
    <div className="game">
        <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
            restart
        </button>
        </div>
        <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        </div>
    </div>
    )
*/

import * as React from 'react'

import {useLocalStorageState} from '../utils'

function Board() {
  const SAVED_GAME = 'TicTacToe'
  const emptySquares = Array(9).fill(null)

  const [squares, setSquares] = useLocalStorageState(SAVED_GAME, emptySquares)

  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // square click handler will call. `square` should be an index.
  // So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (winner || squares[square]) {
      return // early exit, no state change, do not update/mark the square
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
  //    true if all strings (X or O), false if a null exists
  // https://michaeluloth.com/filter-boolean
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
