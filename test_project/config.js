// 配置模块 - 包含弱密码策略

const bcrypt = require('bcrypt');

class UserManager {
  constructor() {
    this.users = [];
  }

  // 危险：弱密码策略
  validatePassword(password) {
    // 只检查长度，没有复杂度要求
    if (password.length >= 6) {
      return true;
    }
    return false;
  }

  // 危险：密码明文存储
  createUser(username, password) {
    if (!this.validatePassword(password)) {
      throw new Error('Password too short');
    }

    // 直接存储明文密码
    const user = {
      id: this.users.length + 1,
      username: username,
      password: password  // 应该使用 bcrypt.hash()
    };

    this.users.push(user);
    return user;
  }

  // 危险：密码比较使用明文
  verifyUser(username, password) {
    const user = this.users.find(u => u.username === username);
    
    if (user && user.password === password) {
      return true;
    }
    
    return false;
  }
}

module.exports = UserManager;

