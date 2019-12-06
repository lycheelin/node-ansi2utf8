const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const fileTypes = [".lrc"];

const inputFolder = "./lrcs/";
const outFolder = "./res/";

function toUtf8(fileName) {
  const filePath = path.join(inputFolder, fileName);
  const outFilePath = path.join(outFolder, fileName);
  let content = fs.readFileSync(filePath);
  // 判断是否为 utf-8
  if (
    (content[0] === 0xef && content[1] === 0xbb) ||
    (content[0] === 0xfe && content[1] === 0xff) ||
    (content[0] === 0xff && content[1] === 0xfe)
  ) {
    // 已经是utf8
    console.log("已经是utf-8，只是拷贝文件", fileName);
    // 不做转换，原文拷贝
    fs.writeFileSync(outFilePath, content);
    return;
  }
  content = iconv.decode(content, "gbk");
  const utf8Content = "\ufeff" + content.toString("utf8");

  fs.writeFileSync(outFilePath, utf8Content);
}

function convert(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.log("object folderPath", folderPath);
    return;
  }
  const files = fs.readdirSync(folderPath);
  files.forEach(fileName => {
    const filePath = path.join(folderPath, fileName);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      if (fileTypes.indexOf(ext) >= 0) {
        toUtf8(fileName);
      }
    } else if (stats.isDirectory()) {
      convert(filePath);
    }
  });
}

// run
convert(inputFolder);
