var container = document.getElementById('spreadsheet');
var elementrow = document.getElementById("rows");
var elementcolumn = document.getElementById("columns");

var workListData =[];
var fileName = "plate"
var columns = 12;
var rows = 8;
var columnHeader = [];
var rowHeader = [];
elementcolumn.value = columns;
elementrow.value = rows;
elementrow.addEventListener('change', handleRowChange);
elementcolumn.addEventListener('change', handleColumnChange);

function load(){
    let height = document.documentElement.clientHeight-  70;
    let width = document.documentElement.clientWidth - 20;
    workListData = [];
    rowHeader = [];
    for(let i=0;i<rows;i++){
      let a = [];
      rowHeader.push(toColumnName(i+1))
      columnHeader = [];
      for(let j = 0; j< columns;j++){
        columnHeader.push((j+1).toString())
        a.push("");
      }
      workListData.push(a);
    }
    var gridElement = document.getElementById("gridDetails");
    var headerDt = document.getElementById("headerDt");
    fileName = getFileName();
    if(gridElement){
      gridElement.style.display = "none";
      headerDt.innerHTML = fileName;
    }

    var hot = new Handsontable(container, {
      data:workListData,
      rowHeaders: rowHeader,
      colHeaders: columnHeader,
      startRows: rows,
      startCols: columns,
      width: width + "px",
      height: height + "px",
      rowHeights: height/(rows+0.5) + "px",
      colWidths: width/(columns + 0.5) + "px",
      licenseKey: 'non-commercial-and-evaluation'
    });
    
}


function generate(){
  var tab = "\t";
  var newLine = "\n";
  var header = "Well"+tab+"Sample Name" + newLine;
  var text =  header;
  for(let rowNum = 0 ; rowNum< rows; rowNum++){
    for(let colNum = 0; colNum< columns; colNum++){
      let spec_no = workListData[rowNum][colNum];
      let well_no = (colNum + 1) + (rowNum * columns);
      if(spec_no){
        text += well_no + tab + spec_no + newLine;
      }
    }
  }
  downloadTemplate(fileName, text);
}

function getFileName(){
  var today = new Date();
  return today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + "T"+today.getHours()+"-"+today.getMinutes()+"-" +today.getSeconds()
}

function printConfig(){

}
function downloadTemplate(fileName, text ){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function handleRowChange(e){
  try{
    rows =  parseInt(e.target.value) || 0;
  }catch(ex){
    console.log(ex);
  }
}

function handleColumnChange(e){
  try{
    columns =  parseInt(e.target.value) || 0;
  }catch(ex){
    console.log(ex);
  }
}

function toColumnName(num) {
  for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
  }
  return ret;
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let i = 0; i< columns + 1; i++) {
    let th = document.createElement("th");
    let text = document.createTextNode(i == 0 ? "" : i);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable() {
  let table = document.getElementById("printTable");
  if(table){
    table.replaceChildren()
  }
  generateTableHead(table);
  for(let rowNum = 0 ; rowNum< rows; rowNum++){
    let row = table.insertRow();
    for(let colNum = 0; colNum< columns + 1; colNum++){
      let cell = row.insertCell();
      let text = document.createTextNode(colNum == 0 ? toColumnName(rowNum + 1): workListData[rowNum][colNum - 1]);
      cell.appendChild(text);
    }
  }
  document.body.appendChild(table);
  window.print();
}

document.addEventListener('keydown',function(e){
  if(e.ctrlKey && e.keyCode == 80)
  {
    e.preventDefault();
    generateTable();
    return false;
}
  return true;
});