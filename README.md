# ef.js
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/ClassicOldSong/ef.js/master/LICENSE) [![npm](https://img.shields.io/npm/dt/ef.js.svg?style=flat-square)](https://www.npmjs.com/package/ef.js) [![Build status](https://img.shields.io/travis/TheNeuronProject/ef.js.svg?style=flat-square)](https://travis-ci.org/ClassicOldSong/ef.js) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2FTheNeuronProject%2Fef.js.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2FTheNeuronProject%2Fef.js?ref=badge_shield)
<img align="right" width="95" height="95" title="logo of ef" src="https://user-images.githubusercontent.com/10512422/39509793-19724b72-4e1a-11e8-8abc-231e48641242.png">

(maybe) An elegant HTML template engine & basic framework

ef.js is a static template framework for browsers, with which you can write your UI without concerning about the logic, or writing logic without concerning about the UI.

ef.js also provides a simple template-engine which helps you create component modules with data binding at ease, but you can also use your favourite template-engine which is compatible with ef.js's AST.

ef.js is well compatible with [WebComponents](https://www.webcomponents.org/), and is probably the only existing front-end framework that handles XML namespaces properly.

[Official Website (WIP)](https://ef.js.org)

Demo:
+ [TodoMVC](https://classicoldsong.github.io/todomvc-efjs/) - [repo](https://github.com/ClassicOldSong/todomvc-efjs)
+ [dbmon](https://classicoldsong.github.io/js-repaint-perfs/ef/opt.html) - [repo](https://github.com/ClassicOldSong/js-repaint-perfs)
+ The [official website](https://github.com/ClassicOldSong/ef.js.org) is also written with ef.js

Playground:
+ [CodeSandbox](https://codesandbox.io/s/github/TheNeuronProject/ef-starter-template)

Related projects:
+ [ef-core](https://github.com/TheNeuronProject/ef-core) - Core of ef.js (without parser)
+ [Neonclear](https://neon.atm.re) - An ef.js based progressive UI framework (WIP)
+ [bPlayer-ef](https://bplayer-ef.ccoooss.com) - The ef.js based web audio player
+ [eft-parser](https://github.com/TheNeuronProject/eft-parser) - Parser for eft templates
+ [rollup-plugin-eft](https://github.com/ClassicOldSong/rollup-plugin-eft) - Import .ef and .eft templates directly from your code, taking the advantage of ef.js into your project with zero configuration.
+ [SublimeEFMLHighlighter](https://github.com/ClassicOldSong/SublimeEFMLHighlighter) - EFML syntax highlighter for SublimeText3
+ [VSCodeEFMLHighlighter](https://marketplace.visualstudio.com/items?itemName=ClassicOldSong.efml) - EFML syntax highlighter for VSCode
+ [AtomEFMLHighlighter](https://atom.io/packages/efml) - EFML syntax highlighter for Atom
+ [PrismEFMLSyntax](https://github.com/ClassicOldSong/PrismEFMLSyntax) - EFML syntax for [Prism](http://prismjs.com/)

Community projects:
+ [EFML.vim](https://github.com/deluxghost/EFML.vim) by [deluxghost](https://github.com/deluxghost) - EFML (\*.ef, \*.eft) syntax highlighting for Vim
+ [Kefjs](https://github.com/cubesky/Kefjs) by [cubesky](https://github.com/cubesky) - A Kotlin/JS Wrapper for ef.js
+ [parcel-plugin-eft](https://github.com/oott123/parcel-plugin-eft) by [oott123](https://github.com/oott123) - Add ef.js template support for parcel bundler
+ [xml2efml](https://github.com/tcdw/xml2efml) - by [tcdw](https://github.com/tcdw) - Convert XML/HTML snippets to EFML

Implementation in other languages:
+ [ef.qt](https://github.com/TheNeuronProject/ef.qt) Writing Qt applications using the concept of ef

## CDN
[CDNJS](https://cdnjs.com/libraries/ef.js) | [jsDelivr](https://cdn.jsdelivr.net/npm/ef.js/dist/ef.min.js) | [UNPKG](https://unpkg.com/ef.js)

For dev versions:

[CDNJS](https://cdnjs.com/libraries/ef.js) | [jsDelivr](https://cdn.jsdelivr.net/npm/ef.js/dist/ef.dev.js) | [UNPKG](https://unpkg.com/ef.js/dist/ef.dev.js)

## Usage
``` javascript
import { create, onNextRender, inform, exec, bundle, setParser, parseEft, t, version } from 'ef.js'
// or you can use import * as ef from 'ef.js'

version // Version string of ef.js

setParser(someparser) // Change the default parser for ef.js so you can use a different type of template
parseEft('Your awesome template') // Get ef.js ast using default parser

const templateString = 'Your awesome template'
const ast = [/* AST which supported by ef */]

const data = {
  $data: {/* Binding data */},
  $methods: {/* Binding methods */}
}

const template1 = create(template)
const template2 = create(ast)
const template3 = t`
>component1
>component2
.Your awesome template
`

const component1 = new template1() // Create a component without data
const component2 = new template2(data) // Create a component and then updates it's data
const component3 = new template3(data, {component1, component2}) // Use component1 and component2 as custom components in template3

onNextRender(callback) // Cache operations to execute on next render
inform() // Tell ef to cache operations **USE WITH CARE**
exec() // Tell ef to execute all cached operations **USE WITH CARE**
exec(true) // Force execute cached operations **USE WITH CARE**
bundle(callback) // Wrapper for inform() and exec()

component1.$data.something = 'something new' // Update the binding data 'something'
component2.$methods.someMethod = ({e, value, state}) => {
  state.$data.something = 'something new'
  console.log('Event target', e.target)
  console.log('Value passed', value)
} // Update binding method

const logData = val => console.log('Subscribed data updated:', val)
component1.$subscribe('info.data', logData) // Observe a value
component1.$unsubscribe('info.data', logData) // Stop observing a value

component1.$update(data) // Update the whole component state

component1.$refs // Get all referenced nodes

component1.mountingPoint = component2 // Mount component2 to 'mountingPoint' on component1
component1.mountingPoint = null // Detach the mounted component

component1.listMP.push(componet2) // Mount component2 to list 'listMP' mounting point on component1

component1.$mount(...) // Mount method called by ef when trying to mount
compinent1.$umount() // Unmount from parent
component1.$destroy() // Destroy the component when not needed for more memory

```

### ef.js template language (EFML) format
EFML is a completely **logic-free** template language. Just like HTML, there you can do nothing about logic, but EFML provides a easy starting point for data binding and events handling.

Also EFML is the first language that can be parsed into the AST which ef supports.

**Note:** EFML is **very strict to indents**. Wrong indents could lead to a parsing error.

Here is an example.

```efml
Tree structure
Lines not started with >#%@.|+- are considered as comments
The escape character of EFML is '&', for prevention of conflicts with js escapes.
Except for changes of the characters, all the usage should remain the same on all versions.
this is a comment

Lines starting with '>' stand for a new tag
>div
  Lines with exactly one indent after a tag definition are considered to be all things belongs to the defined tag

  Lines starting with '#' stand for attributes
  Mustaches are used for binding data
  Contents inside mustaches after '=' stand for the default value for this binding
  Contents without mustaches stand for static data,
  which means that you can not modify them through ef.js
  #class = {{class = some class name}}
  #style = {{attr.style = background: #ECECEC}}
  #id = testdiv
  #some-attr = some text
  #content

  Lines starting with '%' stand for properties
  %title = Welcome, {{name}}
  %anotherProperty = text

  Lines starting with '@' stand for events
  Contents after ':' are considered as value to be passed to the handler
  @click = updateInfo:{{binding.value}} and static value
  modifier keys now can bind easily
  @mousedown.shift.alt.ctrl.meta = select
  bind to keys is also easy
  @keypress.13 = submit
  use '.prevent' to `preventDefault`, '.stop' to `stopPropagation`, '.stopImmediate' to `stopImmediatePropagation`
  @keydown.8.prevent.stop = stopbackspace
  use '.capture' to capture an event
  @submit.capture.stopImmediate = submit

  Lines starting with '.' stand for text nodes
  .Name: {{name}}&nJob: {{job}}
  >pre
    Lines starting with '|' stand for multiline text
    |Line 1
    |Line 2
    |Line 3
  >br

  Lines starting with '-' stand for single node mounting point
  -node1

  Lines starting with '+' stand for multi node mounting point
  +list1

  '.' after a tag name stand for class names for this tag
  >p.some.{{binding.class}}.class.names

    '#' at the end of a tag name stand for the reference name of the node
    Mustaches after a dot will bind to 'class' automatically
    >span.{{emergency = emergency}}#notice_box
      .Notice: {{notice}}
    .some text
```

For standalone eft parser see [eft-parser](https://github.com/ClassicOldSong/eft-parser).

### Fragments

After version 0.9.0, ef.js now supports fragments, which requires eft-parser to be v0.9.0 and above. A normal template could only have one entry tag, while fragment templates can have multiple, even mounting poings can be put at root level:

```
>div
  .A root level tag
-rootLevelMountingPoint
>p
  .Another root level tag
+rootLevelListMountingPoint
.Root level text node
```

You can use them just like normal templates, behaviors are always the same. Also, a single text node will be treated as fragments as well.

### Helpers

ef.js also provides some helpers for creating `Fragments` and `EFTextFragments`, or transform almost anything into an ef component.

```typescript
// Creats a fragment containing given ef components, non ef components will be automatically transtormed into ef components.
new ef.Fragment(Array<Any>)
```

```typescript
// Creats a single `TextFragment` which contains only the given text. Text on `EFTextFragment` components can be modified with `.text` property.
new ef.EFTextFragment(string)
```

```typescript
// Converts almost anything into an ef component
ef.toEFComponent(Any)
```
### Attribute Mapping

Data on ef.js components are not always that easy to access, so since v0.10.4, a stable version of attribute mapping helper is bundled with ef.js. For documents, please refer to the [comments](https://github.com/TheNeuronProject/ef-core/blob/master/src/lib/map-attrs.js#L50-L67) for now. It would be extremely useful when using with custom components and JSX.

## Custom Components

ef.js can handle custom components in templates since v0.10.4. [Demo on writing logic within ef template using custom component](https://codepen.io/ClassicOldSong/pen/zYGXLyy)

### Scope

Scoping is not done in templates. You can write your template as normal, using whatever tag name you desire for your custom component, like:

```efml
App.eft
>div#root
  >MyComponent#myComponent
  >MyOtherComponent
```

Then you may pass the scope in your script:

```js
import App from 'App.eft'
import MyComponent from 'MyComponent.eft'
import MyOtherComponent from 'MyOtherComponent.eft'

const scope = {MyComponent, MyOtherComponent}
const app = new App(null, scope)
```

If `scope` is not given when initializing the component, ef will treat these custom tags as normal HTML tags.

Note that if you reference a custom component, you'll get the component instance instead of the component's DOM object:

```js
app.$refs.root // DOM object
app.$refs.myComponent // ef component
```

Scoping can also be used to replace some tags. Like:
```js
const scope = {
  MyComponent: 'div',
  MyOtherComponent: {
    tag: 'div',
    is: 'my-web-component'
  }
}
```

`MyComponent` will be rendered as a normal `div` element, while `MyOtherComonent` will be rendered as a `my-web-component`.

### Attributes

Attributes on custom components are mapped to `component[key]`, single way:

```efml
App.eft
>MyComponent#myComponent
  #myAttribute = {{customAttr}}
```

```js
app.$data.customAttr = 'Lorem ipsum...' // This will actually set app.$refs.myComponent.myAttribute
```

### Properties

Properties on custom components are mappde to `component.$data[key]`, single way:

```efml
App.eft
>MyComponent#myComponent
  %my.Property = {{customProperty}}
```

```js
app.$data.customProperty = 'Lorem ipsum...' // This will actually set app.$refs.myComponent.$data.my.Property
```

### Events

Event handling only works on custom emitted events on custom component:

```efml
App.eft
>MyComponent#myComponent
  @myEvent = handleMyEvent
```

```js
app.$refs.myComponent.$emit('myEvent') // This will trigger `handleMyEvent`
```

Note that modifier keys are no longer able to present on custom emitted events, so dont attach modifier key on them.

### Automatic Two Way Binding

Just like what ef requires HTML elements to do to get custom two way binding, a `value` or `checked` property should present on a custom component, together with an `input` or `keyup` or `change` event been emitted when value has been changed. When binding `checked`, only `change` event should be emitted.

```efml
App.eft
>MyComponent
  %value = {{value}}
```

```efml
MyComponent.etf
>input
  #type = text
  @input = handleInput
```

```js
import {mapAttrs} from 'ef.js'
import App from 'App.eft'
import _MyComponent from 'MyComponent.eft'

const MyComponent = class extends _MyComponent {
  constructor(...args) {
    super(...args)
    this.$methods.handleInput = ({state}) => {
      state.$emit('input')
    }
  }
}

const app = new App(null, {MyComponent}) // $data.value will automatically updats with what was changed in MyComponent
```

### Children

You can write custom components with children just like what you do with normal HTML elements:

```efml
>MyComponent
  >div
  >MyOtherComponent
  -mountingPoint
  +listMountingPoint
```

but with one requirement: the custom component that handles children should have a list mounting point or an attribute named `children`:

```efml
MyComponent.eft
>div.my-field-set
  >span
    .{{legend}}
  +children
```

## XML Namespaces

ef.js now handles custom XML namespaces since v0.12.0, which allows ef.js to be able to handle svg fragments easily.

### Namespace Usage

Just like what you do in XML:
```efml
Render this `div` tag under a given namespaceURI
>div
  #xmlns = http://some.namespace.example.com/myns
```
```efml
Render these tags with given namespaceURI by local prefix
>myns:div
  #xmlns:myns = http://some.namespace.example.com/myns
  >myns:h1
  >myns:table
```
```efml
Render only parts of an SVG element
>svg:path
```
```efml
Render only parts of an MathML element
>math:matcion
```

You must declare your namespace prefix before using your prefix either [globally](#global-namespaces) or [locally](#local-namespaces).


### Global Namespaces

ef.js has 4 [built-in global namespaces](https://github.com/TheNeuronProject/ef-core/blob/master/src/lib/utils/namespaces.js#L2-L5), which are `html` for HTML elements, `svg` for SVG elements, `math` for MathML elements and `xlink` for `xlink` attributes. You can register custom global namespaces using `declareNamespace`:
```js
import {declareNamespace} from 'ef.js'

declareNamespace('myns', 'http://some.namespace.example.com/myns')
```

Then you can use it everywhere across the whole project.

**Note:**
1. Using global namespaces with prefix will make it's children also inherit it's namespace.
1. Re-declareation the same prefix will throw out an error.

### Local Namespaces

ef.js supports a XML-like local namespace declaration:
```efml
>myns:div
  #xmlns:myns = http://some.namespace.example.com/myns
```

Then you can use the namespace across the whole template.

**Note:**
1. What efml namespaces differs from actual XML local namespaces is that in XML it works only for itself or it's children, while in efml this declaration works across the whole template no matter where you define it.
1. Local defined namespaces only works when a tag is prefixed with the defined prefix. Children of it will not inherit the namespace.
1. Re-declaration will NOT give en error.

### Namespacing in Scopes

When an tag is scoped, it will use the scoped tag's namespace, if the tag has no prefix, it will use the original `xmlns` instead if only `namespaceURI` is not set on scope option. Scoped prefix has higher priority than `namespaceURI`. For example:
```efml
template.eft
>div
  .This tag will be scoped.
```
```js
import Tpl from './template.eft'

const scope1 = {
  div: 'myns:div'
}

const component1 = new Tpl(null, scope1) // in this case it will render a `div` under `myns`

const scope2 = {
  div: {
    tag: 'myns:div',
    namespaceURI: 'http://some.other.ns/myns'
  }
}

const component2 = new Tpl(null, scope2) // in this case the `namespaceURI` is completely ignored, element is rendered under `myns`

const scope3 = {
  div: {
    namespaceURI: 'http://some.other.ns/myns'
  }
}

const component3 = new Tpl(null, scope3) // in this case the `namespaceURI` is not ignored, element is rendered under `http://some.other.ns/myns`
```

## JSX

ef.js now comes with JSX support since v0.9.0. Demo [here](https://codepan.net/gist/192a1870d23e05d775d3667389162e63).

### JSX Fragments

ef.js supports JSX fragments. You can create fragments just like what you do in React:
```jsx
<>
  <h1>Hello JSX!</h1>
  <MyCustomComponent>Now ef.js comes with JSX fragment support!</MyCustomComponent>
</>
```

**Note:** JSX fragments are not always the same from ef fragments. No ef bindings can be set on JSX fragments in the meantime.

### With Transpilers

**Babel:** As documented [here](https://babeljs.io/docs/en/babel-preset-react), you can customize your jsx pragma when using babel. For example:
```cson
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "pragma": "ef.createElement", // default pragma is React.createElement
        "pragmaFrag": "ef.Fragment", // default is React.Fragment
        "throwIfNamespace": false // defaults to true
      }
    ]
  ]
}
```

**Buble:** A [pull request on custom `Fragment` pragma](https://github.com/bublejs/buble/pull/199) has been merged but not yet properly [documented](https://buble.surge.sh/guide/#using-the-javascript-api). Below is a correct example:
```js
var output = buble.transform( input, {
  ...

  // custom JSX pragma
  jsx: 'ef.createElement',
  jsxFragment: 'ef.Fragment',

  ...
}
```

## Server Side Rendering

Use [domino](https://github.com/fgnass/domino) or [JSDom](https://github.com/jsdom/jsdom) for DOM implementation. Only `Node` and `document` is required for customization.

For example using `domino`:

```js
const ef = require('ef.js')
const domino = require('domino')

ef.setDOMImpl({
  Node: domino.impl.Node,
  document: domino.createDocument()
})
```

Then you can use it as it is in browser.

[undom](https://github.com/developit/undom) is currently not supported because it's lack of `documentFragment` support.

## Typing Support

**`HELP WANTED`**

ef.js now has partial experimental typing support using TypeScript flavored [JSDoc](https://jsdoc.app/), which should be compatible with TypeScript. See [ef-core](https://github.com/TheNeuronProject/ef-core/blob/master/src/ef-core.js) and [ef.js](https://github.com/TheNeuronProject/ef.js/blob/master/src/ef.js).

## Run a test
``` bash
git clone https://github.com/ClassicOldSong/ef.js.git
cd ef.js
npm install
npm start
```
Then you can test it out in the opening browser window.

## Build from source
``` bash
git clone https://github.com/ClassicOldSong/ef.js.git
cd ef.js
npm install
npm run build && npm run prod
```
Then you can get the fresh-built `ef.min.js` in the `dist` folder.

**Note:** All debugging messages are disabled in the production version.

## License
[MIT](http://cos.mit-license.org/)


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2FTheNeuronProject%2Fef.js.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2FTheNeuronProject%2Fef.js?ref=badge_large)
