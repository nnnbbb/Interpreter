let getStackTrace = function () {
  let obj = {}
  Error.captureStackTrace(obj, getStackTrace)
  return obj.stack
}
let log = console.log
console.log = function () {
  let stack = getStackTrace() || ""
  let matchResult = stack.match(/\(.*?\)/g) || []
  let line = matchResult[1] || ""
  process.stdout.write(`[${new Date().toLocaleString()}]\t`)
  for (var i in arguments) { }
  if (typeof arguments[i] == 'object') {
    arguments[i] = JSON.stringify(arguments[i], null, 2)
  }
  arguments[i] += '   ' + line.replace("(", "").replace(")", "")
  log.apply(console, arguments)
  global.log = console.log.bind(console)
}

module.exports = {
  log,
}
