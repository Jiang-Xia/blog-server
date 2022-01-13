import { marked } from 'marked';

import * as fs from 'fs';
import * as path from 'path';

/**
 * @description: md文件根据模板转为html文件
 * @param {string} tartgetPath 需转换的md文件路径
 * @param {string} tempPath html模板路径
 * @param {*} output 输出html文件名
 * @return {*}
 */
const parseMDToHtml = function (
  tartgetPath: string,
  tempPath: string,
  outputName,
) {
  // /* 方法二 根据html模板生产新的html文件*/
  //读取准备好的html模板文件
  fs.readFile(tempPath, 'utf8', (err, template) => {
    if (err) {
      throw err;
    } else {
      fs.readFile(tartgetPath, 'utf8', (err, markContent) => {
        if (err) {
          throw err;
        } else {
          //转化好的html字符串
          const htmlStr = marked(markContent.toString());
          // console.log(htmlStr);
          //将html模板文件中的'@markdown' 替换为 html字符串
          template = template.replace('@markdown', htmlStr);
          console.log(template);

          //将新生成的字符串template重新写入到新的文件中（保留模板文件）
          fs.writeFile(assetspath + outputName, template, (err) => {
            if (err) {
              throw err;
            } else {
              console.log('success');
            }
          });
        }
      });
    }
  });
};
const assetspath = path.join(__dirname, '../../assets/');
const filepath = path.join(assetspath, 'HTML和CSS必备知识.md');
const filepath2 = path.join(assetspath, 'template.html');
// parseMDToHtml(filepath, filepath2, 'newHtml.html');
