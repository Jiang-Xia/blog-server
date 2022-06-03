const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jiang123!!',
  database: 'myblog',
});

connection.connect();
// 插入文章数据
// let i = 1;
// while (i <= 100) {
//   const id = Math.random().toString() + i;
//   const addSql =
//     'INSERT INTO article(id,uid,category,content,contentHtml,cover,description,title,tags) VALUES(0,?,?,?,?,?,?,?,?)';
//   const addSqlParams = [
//     '菜鸟工具',
//     1,
//     '897380f6-dbc3-4226-b932-8fd7e38dc179',
//     `[{\"tag\":\"p\",\"attrs\":[],\"children\":[\"测试\"]}]`,
//     `<p>测试${i}</p>`,
//     '测试',
//     '测试',
//     '测试',
//     ['9aa1e201-7fea-4245-9548-d4c9bf3f4503'],
//   ];
//   connection.query(addSql, addSqlParams, function (err, result) {
//     if (err) {
//       console.log('[INSERT ERROR] - ', err.message);
//       return;
//     }

//     console.log('--------------------------INSERT----------------------------');
//     console.log('第' + i + '条');
//     console.log('INSERT ID:', result);
//     console.log(
//       '-----------------------------------------------------------------\n\n',
//     );
//   });
//   i++;
// }

// 插入评论数据
let k = 1;
while (k <= 10) {
  const id = Math.random().toString() + k;
  const addSql =
    `INSERT INTO comment(id,articleId,content,uid) VALUES(${id},${k},${k},${k})`;
  // const addSqlParams = [k, '内容' + k, 1];
  // console.log(new Date().getTime(), "time1")
  // 先执行玩for循环再插入的
  // connection.query(addSql, function (err, result) {
  //   if (err) {
  //     console.log('[INSERT ERROR] - ', err.message);
  //     return;
  //   }

  //   console.log('--------------------------INSERT----------------------------');
  //   console.log('第' + k + '条');
  //   // console.log(new Date().getTime(), "time2")

  //   // console.log('INSERT ID:', result);
  //   console.log(
  //     '-----------------------------------------------------------------\n\n',
  //   );
  // });
  k++;
}
connection.end();
