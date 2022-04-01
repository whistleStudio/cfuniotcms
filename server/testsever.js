const hash = require("object-hash")

for (let i in Array(3).fill(0)) {
  let str = "sd"
  let o = Symbol("sd")

  console.log(o.toString())
}
console.log(hash({a:1}))
console.log(hash({b:1}))