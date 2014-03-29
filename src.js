// this section runs within a worker later on
if (typeof WorkerGlobalScope !== 'undefined' && this instanceof WorkerGlobalScope) {
  onmessage = function(e) {
    self.console = {
      log: function () {
        e.ports[0].postMessage(['log', Array.prototype.slice.call(arguments)])
      },
      warn: function () {
        e.ports[0].postMessage(['warn', Array.prototype.slice.call(arguments)])
      },
      error: function () {
        e.ports[0].postMessage(['error', Array.prototype.slice.call(arguments)])
      },
      info: function () {
        e.ports[0].postMessage(['info', Array.prototype.slice.call(arguments)])
      },
      count: function () {
        e.ports[0].postMessage(['count', Array.prototype.slice.call(arguments)])
      },
      debug: function (){
        e.ports[0].postMessage(['debug', Array.prototype.slice.call(arguments)])
      }
    }
    onmessage = null
    importScripts.call(this, location.hash.substring(1))
  }
}

// this section runs on the main thread
else {
  var script = document.scripts[document.scripts.length -1]

  window.NativeWorker = Worker
  Object.defineProperty(window, 'Worker', {writable: true})

  window.Worker = function Worker (url) {
    var signal = new MessageChannel
      , worker = new NativeWorker(script.src + '#' + url)
    worker.postMessage(url, [signal.port2])
    signal.port1.onmessage = function (e) {
      console[e.data[0]].apply(console, e.data[1])
    }
    return worker
  }
}