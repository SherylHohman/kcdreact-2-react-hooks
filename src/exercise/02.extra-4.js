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

//-------------------------
//  Update.
//  1. when Stringify removes all undefined values, and "disapears" those
//    variables, object properties, array items, etc, it does so slightly
//    different, in an intelligent way for arrays. It replaces `undefined`
//    with `null`, so that indexing is not disturbed (which would destroy the
//    data object!) However, I think it is still worth making a substitution,
//    because if the array items are passed to a function, that sets a default
//    value for anything that is `undefined`, then passing in a `null`, would
//    NOT trigger the default value substitution, and thus could cause bugs.
//    Hence, IMHO, it is important to distinguish between `null` and `undefined`.
//    So my string substitution mentioned somewhere below, is still on the table.

//  2. I found better documentation on `replace` optional parameter to
//    JSON.stringify. Namely, I can define a function to do the substitutions
//    I want. And `stringify` operates recursively, so that takes care of
//    *that* headache I did not want to deal with!
//    And since I will NOT be attempting to write wrapper objects, the whole
//    idea seems much more manageable.

//  3. Sets is another item that stringify does incorrectly.
//    (do not rem if it gives an empty object, an empty array,
//     or just ignores it compoletely)
//    What I *d8* remember is that I can just turn it into an Array & stringify that.
//    (Problem remains that we may give the user back a bad data type -- they
//    expect Set uniqueness, but get back an array?. Hopefully the user/program
//    knows to turn it back into a set.) Alternatively I could turn the thing
//    into a string?? pre-pended with "SET" or something. then take that as a
//    re-encoding clue??
//    Better yet (if it is not a nested property), the expected data type
//    could be passed into the setState/useState Store.getItem and useEffect
//    Store.setItem function, and I can use that to create a Set, using the
//    restored "Array".

//    4. Recap on the datatypes that need special attention:
//        - functions and symbols will always be dropped. cannot be saved/restored
//            That is fine. (?). They are not traditional "data types anyhow.
//            And JSON is inapropriate anyway. No expectation that it could be.

//        The OTHERS, However, we do have an expectation that it is not limited:
//        - bigInt needs to be converted to string, it does NOT have a toJSON method
//        - Sets (object instanceof Set)
//        - Number: NaN, Infinify, Number.NEGATIVE_INFINITY
//        - undefined if in an array (Object.isArray())
//        - (undefined in other instances can probably be ignored and left out
//            of JSON conversions as is standard.
//            programatically it will be the same.
//            Just make sure that any missing properties default to `undefined`.)
//            WAIT. That would make Storage.setItem store "nothing", aka akin to
//            an empty string, if it is a simple variable (not part of an
//            object or array...) Hmmm...maybe I should revisit th eencoded
//            String theory, or passing in the expected dataType (if top level).
//        - Another thing is that I am IGNORING quotation mark issues in strings!!
//            Not sure if/how JSON handles that. Hopefully it escapes stuff
//            correctly, And Parse handles it too. Unfortunately, there ARE
//            cases where thr wrong type of quotation mark can cause issues,
//            or where escape sequences will not quite work.
//            JSON really is not a perfect data transport method!!
//            I'll ignore, and gloss over this!
//    5. JSON5: Finally, if all else fails, there is a JSON5 package on npm and
//        also available as an script url that handles most of the datatype
//        limitations listed here!! And some stuff I do not care about.
//

// OK, so in this case, since we are storing Data, not exclusively strings,
//   I think I'll let `undefined` values remain as `undefined` values.
//   Also, since, programatically, `undefined` similar to a variable, or
//      property not even exisiting, perhaps it would be prudent to just
//      let JSON.stringify handle it in its usual way: ignore and simply
//      refuse to encode any variable/property on an object that is
//      `undefined`.
//   However, I do see an issue arrising with Arrays. If a value of
//      `undefined` gets skipped over, the length of the array, and the
//      indicies of the other elements in the array would change, which could
//      be disasterous.
//    Sooo, I'll need to think of a way to handle that.
//      (maybe for Arrays, replace undefined with some ridiculously long string
//       that would be most unlikely to occur IRL, then when reading data
//       back in, swap it back? Hacky, and could produce a bug, but definitley
//        fewer bugs than doing nothing.
//      More robust would be to use my initial idea of wrapping everything in
//          in an object stating its dataType, and then the value.
//          but to do that properly, EVERY single variable/property/array-item
//          would need to be individually wrapped as an object. Including
//          every level of nesting.
//          I am not willing to do that for this exercise.
//          I am not sure I am even willing to do a string replacement,
//          recursively, whether for EVERY undefined in every object or array
//          or variable, or even just the ones in Arrays, where it could be
//          the most consequential.
//       )
//  ----------------------------

function useLocalStorageState(
  storageName,
  defaultValue = 'UNDEFINED-defaultValue-OK?-or-(changeBackToEmptyString)',
) {
  console.log(storageName, defaultValue)

  // lazy initialization from value in storage, (if exists)
  const [data, setData] = React.useState(
    // () =>
    //   JSON.parse(window.localStorage.getItem(storageName))?.data ??
    //   defaultValue,
    //  Official Solution:
    // () => window.localStorage.getItem(keyName) || defaultValue,
    () => {
      //   console.log(`.....restoring......${storageName}...............`)
      const retrieved = JSON.parse(window.localStorage.getItem(storageName))
      let retrievedData = retrieved?.data ?? defaultValue
      let restoredData
      let type = retrieved?.dataType ?? undefined

      console.log('retrievedData', retrievedData, 'type', type)
      switch (type) {
        default:
          // string,
          // case 'null':
          // Object but NOT Set,
          restoredData = retrievedData
          break

        case 'number':
          // number: NaN, Infinity, -Infinity
          restoredData = retrievedData
          // number but NOT NaN, Infinity, Number.NEGATIVE_INFINITY,
          restoredData = retrievedData.toString()
          break

        case 'SOMETHING-SOMETHING':
          // case 'undefined':
          // bigInt
          restoredData = retrievedData.toString()
          break
      }
      return restoredData
    },
  )

  const JSONreplacer = function () {}
  const parseReviver = function () {}
  // TEMP silence compiler TODO: remove
  JSONreplacer()
  parseReviver()

  // update Storage when its value changes;
  React.useEffect(() => {
    // Strings used to encode/parse data that JSON.stringify does not natively
    //  preserve original data (and we are interested in preserving)
    const UNDEFINED = '**JSON_STRINGIFIED**_UNDEFINED'
    const NAN = '**JSON_STRINGIFIED**_NAN'
    const INFINITY = '**JSON_STRINGIFIED**_INFINITY'
    const NEGATIVE_INFINITY = '**JSON_STRINGIFIED**_NEGATIVE_INFINITY'
    const BIGINT = '**JSON_STRINGIFIED**_BIGINT' //reviver BitInt(remainingstring)
    // null and arrays (without stringed keys) and other objects
    //      (except functions and symbols) are
    //      correclty stringified, natively
    // CANNOT DO:
    // const SYMBOL = 'SYMBOL'
    //   cannot use replacer function will NOT work on Symbols.
    //   it will always return an empty object ! {}
    //   see MDN example at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    //  const STRINGED_ARRAY ='STRINGED_ARRAY'
    // ARRAY with Stringed Keys. It will store a regular array instead
    //  TODO: is there a work around?
    // cannot store a FUNCTION

    const dataType = typeof data
    let storeDataAs

    let storedAsMessage
    let errorMessageCannot = `${storageName}: ${dataType} cannot be stashed to localstorage as intended. It will be restored as ${storedAsMessage}`
    // Invalid arguments are Functions, Symbols, etc, which are not even data types
    // JSON.stringify turns them into undefined and/or discards them altogether
    let errorMessageEncoded = `${storageName}: ${dataType} will be specially encoded with the string
    ..............${storeDataAs}, but *should* be restored with its original value`

    storeDataAs = data
    switch (dataType) {
      case 'undefined':
        // probably best to just use JSON.stringify default behavior, which will simply ignore this value, as though the item never existed
        //  which programatically the same result, AKAIK.
        // TODO: remove this
        // TEMP, to track results
        storeDataAs = UNDEFINED
        console.log(errorMessageEncoded)
        break

      // cannot store
      case 'function':
        storedAsMessage = 'undefined'
        console.log(errorMessageCannot)
        storeDataAs = data
        // stringify turns it into undefined, which does not get output at all.
        // Completely ignored.
        // cannot be stringified

        // Concievably could turn into Encoded String, then to restore, use
        //  var fn = eval("(function() {...})");
        //  BUT, using eval() can be 'evil'
        //  I suspect storate object is NOT SECURE.
        //  So do NOT do this!

        /* Another interpretation of the assignment is to store the name of the function
        //  as an encoded string. Then after decoding, look to the window object to match
        //  an actual function with the funtion name:
            // function we want to run
                    var fnstring = "runMe";

                    // find object
                    var fn = window[fnstring];

                    // is object a function?
                    if (typeof fn === "function") fn();
                //
                // OR
                //
                // function name and parameters to pass
                var fnstring = "runMe";
                var fnparams = [1, 2, 3];

                // find object
                var fn = window[fnstring];

                // is object a function?
                if (typeof fn === "function") fn.apply(null, fnparams);

                BUT I still do not think that is secure. And it certainly is NOT needed
                for this exercise!
            */
        break

      case 'symbol':
        storedAsMessage = '{}'
        console.log(errorMessageCannot)
        // stringify turns it into undefined, which does not get output at all.
        // Completely ignored.
        // Or does it turn it into {}.
        // TODO: DOUBLE CHECK
        //
        // Symbol stringify as undefined. But can use someSymbol.toString()
        //   // However, if recreate a symbol, it will not reference the ORIG symbol
        //   // so I am not sure how useful it would be to "retrieve" one from storage?
        storeDataAs = data
        break

      // encoded, depending
      case 'bigint':
        storeDataAs = BIGINT + data.toString
        console.log(errorMessageEncoded)
        // stringify natively produces a runtime error
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
        // BigInt produces error, but can instead convert it to a string
        //   //  MDN on bigInt suggests adding this, then JSON.stringify will work on a bigInt
        //   //  BigInt.prototype.toJSON = function() { return this.toString()  }
        //   //  I'll just convert it manually though, instead of adding to the prototype
        //  BigInt (new in ECMAScript 2020)	"bigint"
        // MDN suggests adding to the Prototype:
        //    BigInt.prototype.toJSON = function() { return this.toString()  }
        // But this is generally considered a bad idea (see no harm in this case)
        // But I have to handle *other* cases anywat, so just do it here instead. Plus JIC it *is* a bad idea.
        break

      case 'number':
        // regular numbers are fine, no encoding necessary
        storeDataAs = data
        // These numbers are incorrectly JSON.stringified as null.
        if (Number.isNaN(data)) {
          storeDataAs = NAN
          console.log(errorMessageEncoded)
        } else if (data === Number.POSITIVE_INFINITY) {
          storeDataAs = INFINITY
          console.log(errorMessageEncoded)
        } else if (data === Number.NEGATIVE_INFINITY) {
          storeDataAs = NEGATIVE_INFINITY
          console.log(errorMessageEncoded)
        }
        break

      case 'object':
        storeDataAs = data
        // Note:
        //  - Associative Arrays (Arrays with stringed indexes will be stringified
        //  as regular numberical indexed arrays. If stringed keys are needed,
        //      the data should be an (regular) object instead
        //  - Sets will be stored/restored as Arrays, Can check if a Set via:
        //      foo instanceof Set; // true
        //      Theoretically could encode a set inside an object with a special key...
        //  - Maps, I dunno, but to check for this datatype can use
        //      foo instanceof Map; // false
        //      see: https://stackoverflow.com/a/29926193/5411817
        //  + null is correctly stringified
        //  + array is correctly stringified
        //  + objects (regular) are correctly stringified, but cannot have single quotes.
        break

      default:
        // Boolean, String, (and anything I forgot)
        storeDataAs = data
        break // in case move it higher in the switch chain
    }

    const stringifiedData = JSON.stringify(storeDataAs)
    console.dir({storageName, data, storeDataAs})

    console.log('-------storing------')
    console.log(`- ${storageName}:  ${stringifiedData}`)
    window.localStorage.setItem(storageName, stringifiedData)
  }, [storageName, data])

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
      storageName: {storageName} <br />
      {/* hello data: {(data && data.toString()) || 'FALSEY JSX VALUE'} <br />
      storedData: {(storedData && storedData.toString()) ||
        'FALSEY JSX VALUE'}{' '}
      <br />
      <br /> */}
    </div>
  )
}

function App() {
  //   const dummyFunction = function () {
  //     console.log('do nothing')
  //   }
  //   const dummySymbol = Symbol('aDummySymbol')
  return (
    <>
      <div>
        <h5>JSON.stringify straight-forward</h5>
        <StashData data={5} storageName="stash-number" />
        <StashData data={'hello'} storageName="stash-string" />
        <StashData data={true} storageName="stash-Boolean" />
        <StashData data={null} storageName="stash-Null" />
      </div>
      <div>
        <h5>
          objects, arrays easy, but may need to handle their special values
        </h5>
        <StashData data={{a: 'a', b: false}} storageName="stash-SimpleObject" />
        <StashData
          data={{a: 'a', b: false, nested: {emptyString: ''}}}
          storageName="stash-NestedObject"
        />
        <StashData data={[0, 1, 2, 3]} storageName="stash-Array" />
      </div>
      <div>
        <h5>undefined</h5>
        <StashData data={undefined} storageName="stash-Undefined" />
      </div>
      <div>
        <h5>special numeric values</h5>
        <StashData data={NaN} storageName="stash-NaN" />
        <StashData data={Infinity} storageName="stash-p-Infinity" />
        <StashData data={-Infinity} storageName="stash-n-Infinity" />
      </div>
      <div>
        <h5>cannot do</h5>
        {/* <StashData data={dummyFunction} storageName="stash-Function" /> */}
        {/* <StashData data={dummySymbol} storageName="stash-Symbol" /> */}
      </div>
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

    // const mySet = new Set([new String('a set'), new Boolean(true)]);
    // console.log('Set:', typeof mySet);  //object or undefined
    // console.log(JSON.stringify(mySet));

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
