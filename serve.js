const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8083;
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  // Remove query string for file path
  const urlPath = req.url.split('?')[0];
  console.log(`${req.method} ${req.url} -> ${urlPath}`);

  // Handle root path
  let filePath;
  if (urlPath === '/' || urlPath === '') {
    filePath = path.join(ROOT, 'demo', 'index.html');
  } else {
    // Remove leading slash and join with ROOT
    const cleanPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
    filePath = path.join(ROOT, cleanPath);
  }
  
  // Security: prevent directory traversal - use resolve to get absolute path
  const absolutePath = path.resolve(filePath);
  const rootPath = path.resolve(ROOT);
  
  if (!absolutePath.startsWith(rootPath)) {
    console.log(`Blocked: ${absolutePath} (outside ${rootPath})`);
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  filePath = absolutePath;
  console.log(`Serving: ${filePath} (exists: ${fs.existsSync(filePath)})`);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.log(`404: File not found: ${filePath}`);
        res.writeHead(404);
        res.end(`File not found: ${filePath}`);
      } else {
        console.log(`500: Server error: ${error.code} - ${filePath}`);
        res.writeHead(500);
        res.end(`Server error: ${error.code}`);
      }
    } else {
      console.log(`200: Serving: ${filePath}`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Demo page: http://localhost:${PORT}/demo/index.html`);
});
