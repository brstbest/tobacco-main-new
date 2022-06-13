
const XLSX = require("xlsx")

function readXLSX(file) {
  console.log('in')
  let nameSplit = file.name.split(".");
  let format = nameSplit[nameSplit.length - 1];
  if (!["xlsx", "csv"].includes(format)) {
    return false;
  }
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = evt => {
      let data = evt.target.result; // 读到的数据
      let workbook = XLSX.read(data, { type: "binary" });
      resolve(workbook);
    };
  });
}
