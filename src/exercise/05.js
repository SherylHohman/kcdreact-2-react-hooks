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
  //  the node changes. (In a way, I said that inside out, or backwards.
  //  but depending on one's point view, it can make more sense to speak as though
  //  coming from that point of view from the DOM instead of from React)

  // UPDATE:
  // SO.. I *think* this component never "re-renders"
  // I think in this case, the library directly controlls
  //  this DOM node, and react does not touch it after initial render, unless it is to be removed.
  //  The library manipulates the node, its events, and visuals
  // So the Ref does not change.
  // ...or even if React were to re-render it, the Ref used by the
  //  library does not change, because we gave it an [] empty dependancy array!

  // But because the Ref does not actually ever change, I *think*
  //  I am not sure we actually *need* to give it an *[]* empty dependancy array.
  //  Seems [vanillaTiltRef] would work just the same.
  // It seems that *in this case, as is* even leaving the param off
  //  would probalby work just the same, because the element never re-renders (?)
  //  BUT I would *not* suggest doing that! JIC

  const vanillaTiltRef = React.useRef()
  console.log('vanillaTiltRef:')
  if (vanillaTiltRef) {
    console.dir(vanillaTiltRef)
  }
  console.log('\n')

  React.useEffect(() => {
    // empty dependancy array so it only gets called: once at mount
    //  (plus once at dismount, though that does not happen in *this* version of the app)

    const vanillaTiltInitialOptions = {
      reverse: true,
      glare: true,
      'max-glare': 0.5,
      reset: false, // default true; false = If the tilt effect has to be reset on exit
      'full-page-listening': true, //prefer true, but start with false
      // scale: 1.5, // 2 = 200%, 1.5 = 150%, etc.. //prefer larger, but start with default `1` (no zooming on hover)
    }

    // const DoddsSuggestedOptions = {}
    //     max: 25,
    //     speed: 400,
    //     glare: true,
    //     'max-glare': 0.5,
    // })

    /* at each render, the React Ref to the DOM node changes. So must update the
    //  library to reference the new REF, in order for React and the library to
    //  interact with it.

    // update the library with the new React Reference to the DOM node hosting
    // this library's "vanilla-tilt" element.
    // const element = document.querySelector(".js-tilt");
    // this is how docs say to locate or get a handle to the DOM element
    // where the library is instanciated.
    // But that is when NOT using React.
    // since we are using react, we get a handle on the DOM element by asking
    // React for a `ref` to the DOM element.
    */
    // const element = document.querySelector(".js-tilt");

    // the DOM node is saved to vanillaTiltElement
    const vanillaTiltElement = vanillaTiltRef.current // the DOM node
    //Usually an ELEMENTnode, but could also be a DOCUMENTnode,
    // if full-page-listening is set.
    // Hence "Element" is not necessarily technically correct. Node *is*).
    // Also, it could be a NodeList (list of nodes), as per vanilla-tilt API

    VanillaTilt.init(vanillaTiltElement, vanillaTiltInitialOptions)
    console.log('Initialized vanilla-tilt:')
    if (VanillaTilt && vanillaTiltElement) {
      console.dir(vanillaTiltElement)
    }
    console.log('\n')

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

    const cleanup = () => {
      if (!VanillaTilt || !vanillaTiltElement) {
        console.log('There is no vanilla-tilt element to destroy')
        console.dir(vanillaTiltElement)
        console.log('\n')
        // somehow hot loading is causing an error, cleanup is called, but
        //  there is no existing element. But if reload the page, all is well.
        // ...
        // HA! Somehow, I did *not* have an [] empty dependancy array.
        //  THAT is what caused this error!
      } else {
        console.log('Destroying...:')
        console.dir(vanillaTiltElement)
        console.log('\n')
        // removes the listener before React removes the DOM node
        // (vanillaTiltElement IS the DOM node.

        // VanillaTilt.destroy(vanillaTiltElement)
        vanillaTiltElement.VanillaTilt.destroy()

        // REM in JS, it is: myDIV.removeEventListener("mousemove", myFunction);
        // https://www.w3schools.com/jsref/met_element_removeeventlistener.asp
        // in vanilla-tilt repo, this function indirectly calls, eg:
        //  this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
        // (as well as a bunch of other stuff)
      }
    }

    return cleanup
    // return () => vanillaTiltElement.VanillaTilt.destroy()
    // return () => tiltNode.vanillaTilt.destroy()

    // any return value is used as the cleanup function
    /* Normally would not create separate cleanup function, but instead write it
        inline like so:
          return () => VanillaTilt.destroy(vanillaTiltRef.current)
        or for a more complex function:
          return () => {
            ...
            VanillaTilt.destroy(vanillaTiltRef.current)
            ...
          }
        I ONLY do it this way here to EMPHASIZE and get it STUCK in my HEAD
          that cleanup/destruction is what the return value of useEffect is for.
      ----
        REM:
        this cleanup code (from *this* render is always run just before the
          useEffect code (from the *next* render) is run)
        In our case, we set useEffect to only run when the component is mounted,
          and then again when it is dismounted, but never on re-render (empty
          dependency array)
        So the only thing we need it to do, is delete the eventHandlers when the
            component dismounts.
            Vanilla-Tilt docs (https://www.npmjs.com/package/vanilla-tilt)
            indicate that element.VanillaTilt.destroy() does this.

         Destroy instance
         Delete the "old" React reference, the old library connection to the DOM
         (and if it is a re-render, the new instance of useEffect will create a new
         reference and re-link it to the library -- see code above)
    */
    // })
    // }, [vanillaTiltRef])
  }, [])

  /* consider adding the following PR
  // 🐨 add a `React.useEffect` callback here and use VanillaTilt to make your
  // div look fancy. See: Vanilla Tilt [usage examples](https://micku7zu.github.io/vanilla-tilt.js/)
  */

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
    <div ref={vanillaTiltRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  )
  //  SH Note: children/inner elements to the Ref'd "root" vanilla tilt element
  //  are used in the perspective warp option, giving that 3D effect.
}

function App() {
  return (
    <Tilt>
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  )
}

export default App

/* SH NOTES:
  Styles for this app (this file) are defined in the file ../styles.css
    (S:\Classes\Epic_React_Pro-KentCDodds-course-211130\2-react-hooks\src\styles.css)
  They are taken directly from the VanillaTilt repo demo site

  ----- How to read docs, and translate how to apply plain JS instructions
        to a React codebase.
        When they want a DOM element (they get via document.querySelector)
        We just substitute in our instance of useRefVariable.current in its place.
        And otherwise follow the instructions for using plain JS
        (rather than the html version?)

  So, from the examples file (linked to in the README.md docs): https://micku7zu.github.io/vanilla-tilt.js/

  How to use:
    <div class="your-element" data-tilt></div>
  ie, add `data-tilt` to the element, (and also have to add the vanilla-tilt script to the end of the file)

  Then it shows that if you want to add OPTIONS, do it this way:
    <div class="your-element" data-tilt data-tilt-max="50" data-tilt-speed="400" data-tilt-perspective="500"></div>
  ie, list vanilla-tilt options as (attributes - "properties") on the html element.

  Finally, it show the plain "JS Way" it to do:
    VanillaTilt.init(document.querySelector(".your-element"), {
      max: 25,
      speed: 400
    });

  NOTICE THAT document.querySelector(<classname>) IS A HANDLE ON THE DOM "node"/ELEMENT
    IN OUR CASE, REACT REF (from useRef and useEffect ourRef.current)
    IS OUR HANDLE. We do not use a classname (which is JS way of FINDING the DOM node)
    We use the REF we created.
  So (below) instead of "elementName", we are giving it our REF (useRefInstance.current).current

  Compare this to The way we use React.createElement to create JSX
    React.createElement(elementName, properties, children)
  OR in the format
    React.createElement(elementName, {children, ...properties})

  Extrapolating the plain JS Way and React.createElement 2nd format, we get:
    React.createElement(elementName, { <vanilla-tilt options as key value pairs>})
  AND noting that elementName in our case is our REF (vanillaTiltRef.current)
  we get the following:
    React.createElement(vanillaTiltRef.current, { <options> })

  And translating that back to JSX we have:
    <div ref=vanillaTiltRef {<vanilla tilt options>} className="className" miscOtherProperties>
    {children}</div>

  SOOOoooo: now we get at the example code they provide:
    <div...

    VanillaTilt.init(tiltNode, {
  //   max: 25,
  //   speed: 400,
  //   glare: true,
  //   'max-glare': 0.5,
  // })
  // where tiltNode = vanillaTiltRef.current

  -----

  More notes on how I think about how to translate library usage
		instructions from vanilla JS usage and DOM access (via document.querySelector)
		to how to use it with React and a useRef variable (myUseRefVar.current)
	As well as how to interpret the usage "docs"/examples in general
	The comments are very raw, and many are incorrect. It is my live
		thought processes, trying to figure it out, with as little "peeking"
		at the exercise coding hints as possible.

  One point I need to pay attention to is that there are 2 very different
		parts to the usage. One is the HTML (in my case JSX) element.
		And the other part is the JS script that is needed to "activate"
		or attach the library script to that HTML (JSX) element, including
		the preferred tilt options we want it to run with.

  This is the part I was just beginning to see as I stopped for the
		night. Originally, I thought it was one or the other ( I know... duh)
		So, this library is a script that gets attached to an element.
		The other part is the API to attach their script to the element,
		AND set some configurable options for how their script will run.
		Their script will takes care of the event listeners, the cursor, and
		TRANSFORMING the element (warping the graphic, colors, etc).

  It turns out that the biggest hurdle of this library might have been in
    understanding what it is actually doing, and the basics of how it works. Now
		that I think I understand (am developing an understanding of) the library
		itself, in terms of its vanilla JS implementation, it seems the React
    portion may be fairly easy and straight forward.
    - A useRef.current variable simply replaces the
		  `document.QuerySelector(".classname"-"id"-or-whatever)`.
    - a function call `VanillaTilt.init()` attaches their script to a DOM
      element that is passed into this function call.
    - optionally, a set of custom options can also be passed into this `init`
      function as a second argument, in the form of an object.
    - their script attaches an event handler to the given DOM element.
      As such, we need to remove the event handler when it is no longer relevant
      `VanillaTilt.destroy()` removes the event handler.
      It is to be called if: 1) we no longer want vanilla-tilt to control
      (produce side effects, manipulate the graphical display) of the element,
      or 2) we remove the element from the DOM.
      Its parameter is the same as the (1st argument) of the init function:
      a DOM reference.
      In our case, that is our `useRefVariable.current` or in vanillaJS, the
      document.querySelector(".classname"-"id"-or-whatever).

      ----

      OK, made a couple PR's to Vanilla Tilt that got merged!
       -(typos on main branch README.md)
       - typos on gh-pages branch: Examples page, and README.md (same as on main)

       And finally, I think I understtand BOTH vanilla tilt AND how to use it
        with React. create a useEffect, that is called only once (so an EMPTY []
          dependency array) to call its initialization the script
          (`vanillaTilt.init`), which attaches the script to the DOM node (REF)
          we give it, and sets the options we (optionally) can pass in as well.
            ie: `vanillaTilt.init(myRef.current, optionsObject)`
          useEffect also sets the cleanup function `vanillaTilt.destroy()`
            ie: `vanillaTilt.destroy(myRef.current)

      Note that the inner elements (children elements to the vanilla-tilt "root"
        element) are used for the parallax effect option, and is acheived by
        through the `transform` and `transform-style` settings.

*/
