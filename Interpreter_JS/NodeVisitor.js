class NodeVisitor {
  constructor() { }
  visit (node) {
    let methodName = 'visit' + node.constructor.name
    return this[methodName](node)
  }
}

module.exports = {
  NodeVisitor,
}