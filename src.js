/*

  THIS SECITON ACTS LIKE A WORKER

*/ if (typeof WorkerGlobalScope !== 'undefined' && this instanceof WorkerGlobalScope) {

  onmessage = function(e) {
    self.console = {
      _signal: e.ports[0],
      log: function () {
        console._signal.postMessage(['log', Array.prototype.slice.call(arguments)])
      }
    }
    onmessage = null
    importScripts.call(this, location.hash.substring(1))
  }
}

/*

  THIS SECTION RUNS ON THE MAIN THREAD

*/ else {

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