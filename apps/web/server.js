const next = require('next');
const http = require('http');

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(port, '0.0.0.0', () => {
    console.log(`Web listening on ${port}`);
  });
});
