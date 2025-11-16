// 用户模块 - 包含XSS漏洞

const express = require('express');
const router = express.Router();

// 危险：XSS漏洞
router.get('/profile', (req, res) => {
  const username = req.query.name;
  
  // 直接将用户输入渲染到HTML
  const html = `
    <html>
      <body>
        <h1>Welcome, ${username}!</h1>
        <p>Your profile information:</p>
      </body>
    </html>
  `;
  
  res.send(html);
});

// 危险：反射型XSS
router.post('/comment', (req, res) => {
  const comment = req.body.comment;
  
  res.send(`
    <div class="comment">
      <p>You said: ${comment}</p>
    </div>
  `);
});

module.exports = router;

