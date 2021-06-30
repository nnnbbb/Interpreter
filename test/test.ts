declare global {
  interface String {
    padZero(length: number): string;
  }
}

String.prototype.padZero = function (length: number) {
  let d = String(this)
  while (d.length < length) {
    d = '0' + d;
  }
  return d;
};

console.log('hi'.padZero(5))

export { }