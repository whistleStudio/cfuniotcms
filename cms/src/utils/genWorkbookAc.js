import {roleMap} from "../views/account/dataMap.json"

/* 生成表格 */
function genWorkbook (arr, dataName, sheetCol) {
  let workbook = new ExcelJS.Workbook()
  let sheet = workbook.addWorksheet(`data`)

  sheet.columns =  [
    {header: '序号', key: 'idx', width: '5'},
    ...sheetCol
  ]
  // 表格第一行第二行
  let row1 = sheet.getRow(1), row2 = sheet.getRow(2)
  row1.values = [`${dataName}`]
  row1.font = {size: 14, underline: 'single', bold: true, color: { argb: 'FFFFFFFF'}}
  fillColor(row1, 'FF538DD5')
  sheet.mergeCells(`A1:${String.fromCharCode(65+sheetCol.length)}1`)
  row1.commit()
  let row2val = ["#"]
  sheetCol.forEach(e => row2val.push(e.header))
  row2.values = row2val
  row2.font = {bold: true, color: {argb: 'FFFFFFFF'}}
  fillColor(row2, 'FF538DD5')
  row2.commit()
  // 表格正文
  arr.forEach((v, i) => {
    let row = sheet.getRow(i+3)
    let rowVal = [i+1]
    sheetCol.forEach((e, idx) => {
      if (idx===1) {
        rowVal.push(roleMap[v[e.key]])
      } else rowVal.push(v[e.key])
    })
    row.values = rowVal
    row.eachCell((cell) => {cell.alignment = {horizontal: 'left'}})
    row.commit()
  })
  return workbook
}
function fillColor (row, color) {
  row.eachCell(cell => {
    cell.fill = {type: 'pattern',pattern: 'solid', fgColor:{ argb: color}}
  })
}

export default genWorkbook