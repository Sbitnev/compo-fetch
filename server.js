const http = require('http');

const MOODLE_LOGIN = 'doggestars';
const PORT = process.env.PORT || 3000;

const send = (res, code, text) => {
  res.writeHead(code, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(text);
};

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x');

  if (pathname === '/login' || pathname === '/login/') {
    return send(res, 200, MOODLE_LOGIN);
  }

  const m = pathname.match(/^\/id\/([^/]+)\/?$/);
  if (m) {
    try {
      const r = await fetch(`https://nd.kodaktor.ru/users/${encodeURIComponent(m[1])}`);
      const data = await r.json();
      return send(res, 200, String(data.login ?? ''));
    } catch (e) {
      return send(res, 502, 'upstream error');
    }
  }

  send(res, 404, 'not found');
}).listen(PORT);
