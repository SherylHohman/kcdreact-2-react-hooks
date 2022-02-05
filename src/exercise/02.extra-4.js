// useEffect: persistent state (store any datatype, eg object, array, ..)
// 💯 flexible localStorage hook
// http://localhost:3000/isolated/exercise/02.extra-4.js

import * as React from 'react'

// 4. 💯 flexible localStorage hook

// Take your custom useLocalStorageState hook and make it generic enough to
// support any data type (remember, you have to serialize objects to strings…
//     use JSON.stringify and JSON.parse). Go wild with this!

//---
// SH clarification thoughts on what the exercise wants and what I need to do to
//   achieve it:
//   Using JSON.parse and JSON.stringify so localStorage can save any data
//   type (ie objects and arrays) as opposed to the default, which can only
//   store strings and values (numbers, undefined, null) coerced into strings.

//   Specifically, we want to be able to store arrays and objects in the
//   localStorage, and read them back into the program as their orig data type.
//   I wonder if that would include functions, symbols, etc. I would think not,
//   but.. what if I want to store a function, a symbol, null?

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
//   JSON.stringify turns functions, symbols, undefined, etc into undefined and
//      discards them.

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

//   Also, it seems to me that I want to distinguish between the value
//   undefined/null/NaN/... and the strings 'undefined', 'null', 'NaN', 'Infinity'...
//   So perhaps some special convention can be used to store this type?
//   My thought was to store them as an object with a special property name.
//   But it is not knowable if said object could not exist in the wild with the
//   same contrived structure that I come up with.
//   Perhaps, I cannot store those values, or the user would need to decide if
//   a string or other data-type is expected in those cases.

//   Hmm.. unless EVERYTHING was wrapped in an object that specified the
//   datatype and the data.
//   Then even strings would be stored as a value on the data object, instead of
//   stored as a straight string.
//   I wonder if this is what they are asking. It seems most robust.
//   Hmm.. now I cannot unsee this. It seems messy to store strings, not as a
//     string, but as part of an object. But we are not here to read the local
//     storage directly with our eyes, but in our program. Storage is to Persist Data.
//     not be easy to read in the browser dev tools!
//   Ok, that will be my approach. I think.
//   But I'll start simple. And build up. Maybe.

//   Ok. Start with regular objects and arrays.
//   Nope. I'll start with storing a string in our wrapper object.

function useLocalStorageState(storageName, defaultValue = '') {
  // lazy initialization from value in storage, (if exists)
  const [data, setData] = React.useState(
    () => JSON.parse(window.localStorage.getItem(storageName)) ?? defaultValue,
    //  Official Solution:
    // () => window.localStorage.getItem(keyName) || defaultValue,

    // () => {
    //   const item = window.localStorage.getItem(storageName) ?? defaultValue
    //   const parsed = JSON.parse(item)
    //   console.log('\n....\n', item, '\n', parsed, '\n....\n')
    //   return parsed
    // },
  )

  // update Storage when its value changes;
  React.useEffect(() => {
    const valueType = typeof data
    // let storageObject
    // let setTypes = new Set(['string', 'number', 'boolean', 'bigint'])
    // if (setTypes.has(valueType)) {
    //   //   storageObject.datatype = valueType
    //   //   storageObject.data = data
    //   storageObject = {
    //     datatype: valueType,
    //     data: data,
    //   }
    // } else {
    //   console.log('UNACCOUNTED DATA TYPE', valueType)
    // }

    // const storedData = JSON.stringify(storageObject)
    // // const storedData = JSON.stringify(data)
    // console.log('\n----')
    // console.log('dataType   :', valueType)
    // console.log('dataIN     :', data)
    // console.log('stringified:', storedData)
    // // window.localStorage.setItem(storageName, storedData)

    // const rawName = String(storageName + '-raw')
    // console.log(rawName, data)
    // console.log(storageObject)
    // // window.localStorage.setItem(rawName, data)

    window.localStorage.setItem(
      'stringified-object',
      JSON.stringify({type: valueType, data: data}),
    )
  }, [storageName, data])
  /*
        String	"string"
        Number	"number"
        Boolean	"boolean"
        BigInt (new in ECMAScript 2020)	"bigint"

        Null	"object" (see below)
        Any other object	"object"
        "undefined"
        Function object (implements [[Call]] in ECMA-262 terms)	"function"
        Symbol (new in ECMAScript 2015)	"symbol"
 */

  return [data, setData]
}

function StashData({data = 'defaultString', storageName = 'defaultStorage'}) {
  const [storedData, setStoredData] = useLocalStorageState(storageName, data)

  //   function handleChange(event) {
  //     setStoredData(event.target.value)
  //   }

  // silence the compiler
  if (false) {
    setStoredData()
    console.log(storedData)
  } // DELETE

  return (
    <div>
      hello
      {/* data: {data} <br />
      storageName: {storageName} <br />
      storedData: {storedData} <br />
      */}
    </div>
  )
}

function App() {
  return (
    <>
      <StashData data={5} storageName="stash-number" />
      <StashData data={'hello'} storageName="stash-string" />
      <StashData data={true} storageName="stashBoolean" />
    </>
  )
}
//

// Stringify Examples
/* eslint-disable */
// prettier-ignore
function stringifyExamples(){
    // ARRAYS
    console.log(JSON.stringify([new Number(55), new String('false'), new Boolean(false)]));
    // expected output: '[55,"false",false]'

    // for array, turns alt values into null
    console.log(JSON.stringify([null, undefined, function(){}]));
    // "[null,null,null]"
    // Note the array is wrapped in double, not single quotes. Weird.

    // OBJECTS
    // orig object keys can be without or with either type quote. Numbers store as numbers.
    console.log(JSON.stringify({ x: 5, "y": 6, 'z': 7 }));
    // expected output: '{"x":5,"y":6,"z":7}'

    // everything as expected. boolean is boolean, number is number, string wrapped in quotes.
    console.log(JSON.stringify({num:new Number(55), string:new String('false'), "boolean":new Boolean(false)}));
    // '{"num":55,"string":"false","boolean":false}'

    // objects omits anything with a value of undefined
    console.log(JSON.stringify({null:null, undefined:undefined, "undefined":undefined, "func": function(){return 5}}));
    // '{"null":null}'
    // undefined data type left off, function type left off

    console.log(JSON.stringify( {"data": null }));
    // null is ok

    // undefined and functions, not ok.
    console.log(JSON.stringify( {"data": function(){return 6} }));
    console.log(JSON.stringify( {"data": function(){}, "after-data": 'function/undefined missing' }));
    // functions are like undefined. And so they are ommitted from the returned object.
    //  in these cases, they are the *only* item, so an empty object is returned.
    // wrapped in double quotes.

    console.log(JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)));
    // expected output: ""2006-01-02T15:04:05.000Z""

    let a = 5;
    let b = "smile"
    let c = true;
    let stringifiedData_a = JSON.stringify({type: typeof(a), data: a})
    let stringifiedData_b = JSON.stringify({type: typeof(b), data: b})
    let stringifiedData_c = JSON.stringify({type: typeof(c), data: c})
    console.log(stringifiedData_a)
    console.log(stringifiedData_b)
    console.log(stringifiedData_c)

    /*
    -------------
    >'[55,"false",false]'
    > "[null,null,null]"
    > '{"x":5,"y":6,"z":7}'
    > '{"num":55,"string":"false","boolean":false}'
    > '{"null":null}'
    > '{"data":null}'
    > "{}"
    > '{"after-data":"function/undefined missing"}'
    > '"2006-01-02T23:04:05.000Z"'
    */

}
// stringifyExamples()
/* eslint-enable */

export default App
