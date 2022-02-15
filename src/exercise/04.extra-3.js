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
  const SAVED_GAME = 'TicTacToe-History-04.extra-3'
  const CURRENT_MOVE = 'TicTacToe-historyIndex-04.extra-3'

  const startingSquares = Array(9).fill(null)
  const startingMoveNumber = 0

  // prettier-ignore
  const [gameHistory, setGameHistory] = useLocalStorageState(
    SAVED_GAME,
    [startingSquares]
  ) // I do not like the way prettier formats the "[startingSquares]"

  const [historyIndex, setHistoryIndex] = useLocalStorageState(
    CURRENT_MOVE,
    startingMoveNumber,
  )

  const squares = gameHistory[historyIndex]
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    let newSquares = [...squares]
    let newGameHistory = gameHistory.slice(0, historyIndex + 1)

    newSquares[square] = nextValue
    setGameHistory([...newGameHistory, newSquares])
    setHistoryIndex(historyIndex + 1) // increment index
  }

  function restart() {
    // This creates a new array, nothing is mutated
    setGameHistory([startingSquares])
    setHistoryIndex(startingMoveNumber)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  function renderHistoryList() {
    // the entire list
    return gameHistory.map((squares, index) => {
      let historyLabel = ''
      switch (index) {
        case 0:
          historyLabel = `Return to Start of game`
          break
        case historyIndex:
          historyLabel = `(Currently Showing)`
          break
        default:
          historyLabel = `Return To Move #${index}`
          break // JIC move this option higher
      }

      // each history item
      return (
        <li key={index}>
          <button
            disabled={index === historyIndex}
            className="move"
            onClick={() => setHistoryIndex(index)}
          >
            {historyLabel}
          </button>
        </li>
      )
    })
  }

  return (
    <div className="game">
      <div className="current-move">
        <div className="status">{status}</div>
        <ol start="0" className="history-list">
          {renderHistoryList()}
        </ol>
      </div>
      <div className="current-gameboard">
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

/* SH a puzzle to be answered:
   in selectSquare

   // for some reason above line CRASHES during runtime: WHY!!??!
        setGameHistory(newGameHistory.push(newSquares))

    // so do in 2 steps as below, is absolutely FINE!!:
        newGameHistory.push(newSquares)
        setGameHistory(newGameHistory)

    // more react-ish way, although we are creating a newGameHistory array TWICE
      //  once with slice, then again below.
      // using push, we only create the new state array once.
      // (it only needs to be created once in this function!! to prevent mutation bugs)

        setGameHistory([...newGameHistory, newSquares])
*/

/* SH minor app/file notes:
    // on new game: length=1, moveNumber=1,
    //  but index 0 (historyIndex===0)
    //  current gameboard is stored at game[0].
*/

/* SH minor JS reminder notes:

    // Start a css ordered list at a number other than 1.
    //  pass in start=starting_number
    //  eg: <ol start="0"> to begin the list at 0.

    // REM: pass slice 1 more than the last index we want to keep
    // GOTCHA! REM slice(0,0)==[].
    // slice (firstIndex, lastWantedIndex + 1)
    // If give an end index, it Must ALWAYS be 1 more than want.

    // GOTCHA: do NOT do this:
    //    newGameHistory = newGameHistory.push(newSquares)
    //    // 2 (length of array)
    // REM RETURN VALUE IS LENGTH OF NEW ARRAY - DO NOT SET IT EQUAL TO ANYTHING
    //   PUSH *IS* the changed (mutated) array!

    // squares.every(Boolean)
    // === squares.every( (item) => Boolean(item))
    //    true if all strings (X or O), false if a null exists
    // https://michaeluloth.com/filter-boolean

*/

/*
TODO: submit a PR to clarify the task.
    // clarification: history is for history of MOVES in CURRENT game.
    //     NOT for history of prior game wins/losses (final board)
    //         ala arcade like HIGH SCORES

    FROM:
    "...the extra version supports keeping a history of the game
        and allows you to go backward and forward in time."

    TO:
    "...the extra version supports keeping a history of the CURRENT game
        and allows you to go backward and forward in time."

    Disambiguate between keeping a history (historical record) of
        PAST Games (final game board, showing who won/lost)
        reminiscent of arcade HIGH SCORES, and undo/redo editing feature
        for CURRENT game only.
 */

// SH Notes: the History feature is for storing history of the CURRENT game only.
//  (My thought was saving all prior games! Maybeeee, I 'll try implementing that too.)
//  For tic-tac-toe, prior games history (and my mind's obsession with saving
//      historical data) history record of gameboards & wins/losses seems more
//      interesting. Also, I'm thinking arcade style High Scores, Ha, ha.
//  No. THIS exercise is to save MOVES in the current game, so you can back-up
//      and try again. That seems useful for SOLITAIRE! (less so for tictactoe)
//      But it IS a good exercise. And it is highly relevant for regular usage
//      in apps. For example, editing (text or any data entry!!)
//  So THIS exercise is more relevant, but was not DESCRIBED clearly.
//  History in this context is History of MOVES!
//  Not Game History (or history of past games.)

// TBF, the task at hand WAS quite interesting. And, truth be told, fun to
//  undo and redo.
// Still think language in instructions should reflect the concepts of:
//  undo, redo, and/or Current Game history!!
