let s = "whistle"
let str = `^whistle[0-9]+`
let reg = RegExp(str)
console.log(reg.test(s));