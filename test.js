async function a () {
  throw "sad"
}

// try {
// ;(async ()=> {
//   await a()
// })()
// } catch (e) {console.log('xxx');}
;(async ()=>{
  try {
    await a()
  } catch(e){console.log("xxx");}
})()