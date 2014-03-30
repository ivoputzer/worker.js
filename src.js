// this section runs within a worker later on
if (typeof WorkerGlobalScope !== 'undefined' && this instanceof WorkerGlobalScope) {
  onmessage = function(e) {
    self.console = (function(){
      [
        'assert',
        'clear',
        'count',
        'debug',
        'dir',
        'dirxml',
        'error',
        'exception',
        'group',
        'groupCollapsed',
        'groupEnd',
        'info',
        'log',
        'markTimeline',
        'profile',
        'profileEnd',
        'table',
        'time',
        'timeEnd',
        'timeStamp',
        'trace',
        'warn'
      ]
      .forEach(function(m){
        this[m] = function () {
          var args = Array.prototype.slice.call(arguments)
          e.ports[0].postMessage([m, args])
        }
      }.bind(this))
      return this
    })()
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
      , worker = new NativeWorker(script.src + '#' + url.replace(/^\/*/g, '/'))
    worker.postMessage(url, [signal.port2])
    signal.port1.onmessage = function (e) {
      console[e.data[0]].apply(console, e.data[1])
    }
    return worker
  }
}