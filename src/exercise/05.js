// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

// SH Notes: Here are links to the library docs and usage examples.
//  Sure, Kent *gives us* the code necessary to implement this library.
//  But it is better for my understanding, to not look at that, and instead
//  try to figure out both how to use the library, and how to convert that into
//  how to use the library for React by myself, and at the same time.
//  Otherwise, I get no sense at what part is React related, or even what I did
//  at all, besides copy-paste!
//  Example usage: https://micku7zu.github.io/vanilla-tilt.js/
//    This visually shows what the options do.
//  NPM (or github Readme) API: https://www.npmjs.com/package/vanilla-tilt

import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import VanillaTilt from 'vanilla-tilt'

function Tilt({children}) {
  // 🐨 create a ref here with React.useRef()

  //  each re-render creates a new ref. As the DOM changes, the React ref for
  //  the node changes. (In a way, I said that inside out, or backwards,
  //  but depending on one's point view, it can make more sense to speak as though
  //  coming from that point of view (DOM or React))
  const vanillaTiltRef = React.useRef()

  React.useEffect(() => {
    // at each render, the React Ref to the DOM node changes. So must update the
    //  library to reference the new REF, in order for React and the library to
    //  interact with it.

    // update the library with the new React Reference to the DOM node hosting
    // this library's "vanilla-tilt" element.
    /* const element = document.querySelector(".js-tilt");
    // this is how docs say to locate or get a handle to the DOM element
    // where the library is instanciated.
    // But that is when NOT using React.
    // since we are using react, we get a handle on the DOM element by asking
    // React for a `ref` to the DOM element.
    */
    // const element = document.querySelector(".js-tilt");
    const element = vanillaTiltRef.current
    VanillaTilt.init(element)

    // In our case, we will not ever change the options in the life of our app.
    //  The options just control the way the library changes the graphic as the cursor
    //  moves. It has nothing to do with the cursor changing. In other words, WE
    //  are NOT tracking or updating the cursor coordinates. We are only deciding
    //  IF the graphic should apply certain effects, or to what extent those effects
    //  are applied as the cursor changes.
    // The set of effects we want to use do not change.
    //  HENCE the options NEVER change.  Also, that is why the dependancy array is
    //  empty.  Although the instance of the options object will change, the VALUES
    //  never do. If we do not add an EMPTY dependancy array, react will endlessly
    //  update, since at every render a "new" object is created.
    // An empty Dependancy array means NEVER TRIGGER a re-render when the "value"
    //  changes. However, NOTE that useEffect DOES re-run at Every Render.
    //  And *that* automatically happens (thanks to the library--and our ref) every
    //  everytime the cursor moves (well, if it is hovering over our tilt element,
    //  OR if the use `'full-page-listening' option is set, then whenever the
    //  cursor moves and it is inside the App browser window.)

    // IF the app allowed the user to change the options, the current options
    //  would probably be instead stored in a useState variable.
    const vanillaTiltInitialOptions = {
      reverse: true,
      glare: true,
      'max-glare': 0.5,
      //'full-page-listening': false, //prefer true, but start with false
      scale: 1.1, // 2 = 200%, 1.5 = 150%, etc.. //prefer larger, but start with default `1` (no zooming on hover)
      //"mouse-event-element":  null,   // css-selector or link to HTML-element that will be listening to mouse events
    }

    const cleanup = () => {
      // - this code (from *this* render is always run before the *next*
      //  useEffect (from the *next* render) is run)
      // see Vanilla-Tilt docs for info on what it needs (https://www.npmjs.com/package/vanilla-tilt)

      // Destroy instance
      // Delete the "old" React reference, the old library connection to the DOM
      // (and if it is a re-render, the new instance of useEffect will create a new
      // reference and re-link it to the library -- see code above)
      element.vanillaTilt.destroy()
    }

    return cleanup
    // any return value is used as the cleanup function
  })

  // 🐨 add a `React.useEffect` callback here and use VanillaTilt to make your
  // div look fancy.
  // 💰 like this:
  // const tiltNode = tiltRef.current
  // VanillaTilt.init(tiltNode, {
  //   max: 25,
  //   speed: 400,
  //   glare: true,
  //   'max-glare': 0.5,
  // })
  //
  // 💰 Don't forget to return a cleanup function. VanillaTilt.init will add an
  // object to your DOM node to cleanup:
  // `return () => tiltNode.vanillaTilt.destroy()`
  //
  // 💰 Don't forget to specify your effect's dependencies array! In our case
  // we know that the tilt node will never change, so make it `[]`. Ask me about
  // this for a more in depth explanation.

  // 🐨 add the `ref` prop to the `tilt-root` div here:
  return (
    <div ref={tiltRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Tilt>
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  )
}

/* SH NOTES:
  Styles for this app are located in the file ../styles.css
    (S:\Classes\Epic_React_Pro-KentCDodds-course-211130\2-react-hooks\src\styles.css)
  They are taken directly from the VanillaTilt repo demo site
*/

export default App
