// dist/를 GitHub Pages와 같은 규칙으로 서빙하는 테스트용 서버.
//   /wedding  → wedding.html
//   /wedding/ → wedding/index.html (없으면 404)
//   못 찾으면 404.html을 404 상태로
// astro preview는 /wedding/도 열어 주는 등 규칙이 달라서, 주소 동작을 검증할 때는 이 서버를 쓴다.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../../dist', import.meta.url)));
const port = Number(process.argv[2] ?? 4173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const isFile = (path) =>
  stat(path)
    .then((stats) => stats.isFile())
    .catch(() => false);

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  let file = normalize(join(root, pathname));
  let status = 200;

  if (!file.startsWith(root)) {
    file = join(root, '404.html');
    status = 404;
  } else if (pathname.endsWith('/')) {
    file = join(file, 'index.html');
  } else if (!(await isFile(file)) && (await isFile(`${file}.html`))) {
    file = `${file}.html`;
  }

  if (status === 200 && !(await isFile(file))) {
    file = join(root, '404.html');
    status = 404;
  }

  response.writeHead(status, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  response.end(await readFile(file));
}).listen(port, '127.0.0.1', () => {
  console.log(`dist/ 서빙 중: http://127.0.0.1:${port}`);
});
