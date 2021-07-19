class NodeVisitor {
  constructor() { }
  visit (node) {
    let methodName = 'visit' + node.constructor.name
    if (this[methodName] === undefined) {
      throw new Error(`visit ${methodName} is not a function`)
    }
    return this[methodName](node)
  }
}

module.exports = {
  NodeVisitor,
}