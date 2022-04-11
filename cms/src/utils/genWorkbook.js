// const ExcelJS = require("exceljs")
import {roleMap} from "../views/account/dataMap.json"

/* 生成表格 */
function genWorkbook (arr, dataName) {
  let workbook = new ExcelJS.Workbook()
  let d = new Date()
  let sheet = workbook.addWorksheet(`data`)
  sheet.columns = [
    {header: '序号', key: 'idx', width: '5'},
    {header: '用户名', key: 'value', width: '25'},
    {header: '用户类型', key: 'value', width: '15'},
    {header: '用户邮箱', key: 'value', width: '30'},
    {header: '等级', key: 'value', width: '5'},
  ]
  // 表格第一行第二行
  let row1 = sheet.getRow(1), row2 = sheet.getRow(2)
  row1.values = [`${dataName}`]
  row1.font = {size: 14, underline: 'single', bold: true, color: { argb: 'FFFFFFFF'}}
  fillColor(row1, 'FF538DD5')
  sheet.mergeCells('A1:E1')
  row1.commit()
  row2.values = ['#', '用户名', "用户类型", "用户邮箱", "等级"]
  row2.font = {bold: true, color: {argb: 'FFFFFFFF'}}
  fillColor(row2, 'FF538DD5')
  row2.commit()
  // 表格正文
  arr.forEach((v, i) => {
    let row = sheet.getRow(i+3)
    row.values = [i+1, v.name, roleMap[v.role], v.mail, v.authority]
    row.eachCell((cell) => {cell.alignment = {horizontal: 'left'}})
    row.commit()
  })
  // for (let i in arr) {
  //   i = parseInt(i)
  //   var row = sheet.getRow(i+3)
  //   row.values = [i, ]
  //   row.eachCell((cell) => {cell.alignment = {horizontal: 'left'}})
  //   row.commit()
  // }
  return workbook
}
function fillColor (row, color) {
  row.eachCell(cell => {
    cell.fill = {type: 'pattern',pattern: 'solid', fgColor:{ argb: color}}
  })
}

export default genWorkbook