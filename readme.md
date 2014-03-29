# Worker.js

Workers.js is a utility wrapper of html5's native web worker implementation.
Once this file gets included within your page all of your web workers should
be able to use browser's `console` methods like `log`, `error`, `debug`,
`info` and `warn` from there on.

---

Currently only works in browsers that support `messagechannel` and of course the web worker api.