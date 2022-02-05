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
//     not be read directly (easy to read) in the browser dev tools!
//   Ok, that will be my approach. I think.
//   But I'll start simple. And build up. Maybe.

//   Ok. Start with regular objects and arrays.
//   Nope. I'll start with storing a string in our wrapper object.

function useLocalStorageState(storageName, defaultValue = '') {
  // UH OH! looks like the localStorage value takes precedent over the passed in
  //  value. I changed the definition of the nested-object passed in from the
  //  component "call". But the old version remained in storage after reload.
  //  Is this expected? Wait. Maybe it treats the passed in stuff as a "default".
  //  So that *is* proper. Obviously I need to step away for a break!

  // lazy initialization from value in storage, (if exists)
  const [data, setData] = React.useState(
    () =>
      JSON.parse(window.localStorage.getItem(storageName))?.data ??
      defaultValue,
    //  Official Solution:
    // () => window.localStorage.getItem(keyName) || defaultValue,
  )

  // update Storage when its value changes;
  React.useEffect(() => {
    const dataType = typeof data
    // Invalid arguments are Functions, Symbols, etc, which are not even data types
    // JSON.stringify turns them into undefined and/or discards them altogether
    if (
      dataType === 'function' ||
      dataType === 'symbol' ||
      dataType === 'undefined' || // maybe better to store as data='undefined' (a string)
      dataType === 'bigint' // can instead use special function
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
    ) {
      // invalid datatype (undefined will get the same treatment, implicitly)
      // WARNING: this will may the actual data value in the program!
      //   TODO: See if it is OK to do this. If not, find another way.
      //         This is temp anyway. Undecided on how to handle functions, symbols.
      setData(undefined) // defaultValue? or null? or undefined (cannot be stringified)
      console.log(
        storageName,
        ': ',
        dataType,
        'is an Invalid Datatype. Cannot store it in localStorage. Setting to defaultValue',
      )
    }
    //
    // These datatypes are incorrectly stringified to null:
    //   NaN, Infinity,
    // BigInt produces error, but can instead tconvert it to a string
    //   //  MDN on bigInt suggests adding this, then JSON.stringify will work on a bigInt
    //   //  BigInt.prototype.toJSON = function() { return this.toString()  }
    //   //  I'll just convert it manually though, instead of adding to the prototyee
    // Symbol stringify as undefined. But can use someSymbol.toString()
    //   // However, if recreate a symbol, it will not reference the ORIG symbol
    //   // so I am not sure how useful it would be to "retrieve" one from storage?
    // TODO: store and retieve them with in a special manner
    // TODO: if want to store 'undefined', need to store it in a special manner
    // eg: store the type, and then store the data as a string:
    // "undefined", "NaN", (myBigInt.toString), "Infinity", "-Infinity", (mySymbol.toString)

    //  (while null is incorrectly typed as object, stringify and parse both work as
    //   expected on regular objects and on null, so it is fine to store its
    //   dataType as object, with no special handling
    //   )

    //  Will I have to recurse (drill down) through objects to specially encode
    //    those funky data types for each property value on the object?
    //    Ugh. I would guess: yess.
    //    Maybe create a prototype override then for my special props?. No.
    //    But will likely need to drill down. I am surprised this little
    //      exercise would require that.
    //    Let's just do single level first.

    // Hopefully everything else works as expected.

    window.localStorage.setItem(
      storageName,
      JSON.stringify({type: dataType, data: data}),
    )
  }, [storageName, data])
  /*
        String	"string"
        Number	"number"
        Boolean	"boolean"
        BigInt (new in ECMAScript 2020)	"bigint"

        Null	"object" (see below)
        Any other object	"object"
          // array is an object

        // cannot be stringified
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
      {/*   hello data: {data} <br />
      storageName: {storageName} <br />
      storedData: {storedData} <br />
     */}
    </div>
  )
}

function App() {
  const dummyFunction = function () {
    console.log('do nothing')
  }
  const dummySymbol = Symbol('aDummySymbol')
  return (
    <>
      <StashData data={5} storageName="stash-number" />
      <StashData data={'hello'} storageName="stash-string" />
      <StashData data={true} storageName="stash-Boolean" />
      <StashData data={{a: 'a', b: false}} storageName="stash-SimpleObject" />
      <StashData
        data={{a: 'a', b: false, nested: {emptyString: ''}}}
        storageName="stash-NestedObject"
      />
      <StashData data={[0, 1, 2, 3]} storageName="stash-Array" />
      <StashData data={undefined} storageName="stash-Undefined" />
      <StashData data={null} storageName="stash-Null" />
      special numeric values
      <StashData data={NaN} storageName="stash-NaN" />
      <StashData data={Infinity} storageName="stash-p-Infinity" />
      <StashData data={-Infinity} storageName="stash-n-Infinity" />
      cannot do
      <StashData data={dummyFunction} storageName="stash-Function" />
      <StashData data={dummySymbol} storageName="stash-Symbol" />
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
