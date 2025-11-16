// 认证模块 - 包含SQL注入漏洞

const mysql = require('mysql');

function login(username, password) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'myapp'
  });

  // 危险：SQL注入漏洞
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  connection.query(query, (error, results) => {
    if (error) throw error;
    
    if (results.length > 0) {
      return { success: true, user: results[0] };
    } else {
      return { success: false };
    }
  });
}

function resetPassword(userId, newPassword) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'myapp'
  });

  // 危险：密码未加密存储
  const query = "UPDATE users SET password = '" + newPassword + "' WHERE id = " + userId;
  
  connection.query(query, (error, results) => {
    if (error) throw error;
    return { success: true };
  });
}

module.exports = { login, resetPassword };

