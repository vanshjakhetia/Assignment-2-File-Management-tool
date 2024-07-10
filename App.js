const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  const getFilePath = (filename) => path.join(__dirname, 'files', filename);

  if (pathname === '/create' && req.method === 'GET') {
    const { filename, content } = query;
    if (!filename || !content) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Filename and content query parameters are required');
    }

    const filePath = getFilePath(filename);
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error creating file');
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File created successfully');
    });
  } else if (pathname === '/read' && req.method === 'GET') {
    const { filename } = query;
    if (!filename) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Filename query parameter is required');
    }

    const filePath = getFilePath(filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('File not found');
        }
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error reading file');
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  } else if (pathname === '/delete' && req.method === 'GET') {
    const { filename } = query;
    if (!filename) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Filename query parameter is required');
    }

    const filePath = getFilePath(filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('File not found');
        }
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error deleting file');
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File deleted successfully');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
