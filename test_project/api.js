// API模块 - 包含IDOR漏洞

const express = require('express');
const router = express.Router();

// 模拟数据库
const database = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'user' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
    { id: 3, name: 'Admin', email: 'admin@example.com', role: 'admin' }
  ],
  orders: [
    { id: 1, userId: 1, amount: 100 },
    { id: 2, userId: 2, amount: 200 },
    { id: 3, userId: 1, amount: 150 }
  ]
};

// 危险：IDOR漏洞 - 没有权限检查
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // 直接根据ID返回用户信息，没有验证当前用户是否有权限访问
  const user = database.users.find(u => u.id == userId);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// 危险：IDOR漏洞 - 订单访问
router.get('/order/:id', (req, res) => {
  const orderId = req.params.id;
  
  // 没有检查订单是否属于当前用户
  const order = database.orders.find(o => o.id == orderId);
  
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// 危险：删除用户没有权限验证
router.delete('/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // 任何人都可以删除任意用户
  const index = database.users.findIndex(u => u.id == userId);
  
  if (index !== -1) {
    database.users.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;

