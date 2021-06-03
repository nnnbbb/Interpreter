function sum(...args) {
  let s = args.reduce((a, b) => {
    console.log(a, b)
    return a + b
  })
  console.log(s)
  return function (...x) {
    return x.length == 0 ? s : sum(s, ...x)
  }
}
console.log(sum(1)(1)())

  
