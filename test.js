try {
  let i = 0
  while (1) {
    i++
    if (i>10) throw "gg"
    console.log(i)
  }
  throw "gl"
} catch(e){console.log(e)}
