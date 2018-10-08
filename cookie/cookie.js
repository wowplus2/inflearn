const http = require('http');
const cookie = require('cookie');

http
  .createServer((req, res) => {
    let cookies = {};
    //console.log(req.headers.cookie);

    // Cookie값 읽기
    if (req.headers.cookie !== undefined) {
      cookies = cookie.parse(req.headers.cookie);
    }
    console.log('yummy_cookie: ', cookies.yummy_cookie);
    console.log('tasty_cookie: ', cookies.tasty_cookie);

    // Cookie값 생성
    res.writeHead(200, {
      'Set-Cookie': [
        'yummy_cookie=choco', // Session Cookie: 브라우저가 켜져있는 동안만 살아있다.
        'tasty_cookie=strawberry', // Session Cookie: 브라우저가 켜져있는 동안만 살아있다.
        `Permant=cookies; Max-Age=${60 * 60 * 24 * 30}`, // Permant Cookie: 1달동안 살아있다.
        'Secure=Secure; Secure', // https protocol에서만 노출된다.
        'HttpOnly=HttpOnly; HttpOnly', // javascript(크롬 개발자모드, Console등)에서는 노출되지 않고, http통신시에만 사용된다.
        'Path=Path; Path=/cookie', // url의 path아래에서만 활성화되는 cookie 옵션
        'Domain=Domain; Domain=wowplus.org' // 지정된 도메인 내에서만 가용한 cookie값을 지정하는 옵션
      ]
    });
    res.end('Cookie!!');
  })
  .listen(3001);
