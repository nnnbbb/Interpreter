// const cluster = require('cluster')
// const http = require('http')
// const numCPUs = require('os').cpus().length

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} numCPUs ${numCPUs} is running`)

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork()
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`)
//   })
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   http
//     .createServer((req, res) => {
//       console.log(`Worker ${process.pid} `)
//       res.writeHead(200)
//       res.end('hello world\n')
//     })
//     .listen(8000)

//   console.log(`Worker ${process.pid} started http://localhost:8000`)
// }

let num = 10;
let r1 = String.fromCharCode(num);  // 'a'
console.log(r1)

let str = "   "
for (let i = 0; i < str.length; i++) {
  const element = str[i];
  let r2 = element.charCodeAt() // 65
  console.log(r2)

}