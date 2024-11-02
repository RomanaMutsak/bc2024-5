const express = require('express');
const http = require('http');
const { Command } = require('commander');
const path = require('path');

// Ініціалізація Commander.js
const program = new Command();

program
  .requiredOption('-h, --host <host>', 'Server address')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Path to cache directory')
  .parse(process.argv);

const options = program.opts();

// Створення веб-сервера з Express
const app = express();
const server = http.createServer(app);

// Сервер слухає на заданій адресі та порту
server.listen(options.port, options.host, () => {
  console.log(`Server is running at http://${options.host}:${options.port}`);
});

// Простий роут для тестування
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Перевірка існування директорії кешу
const cacheDir = path.resolve(options.cache);
console.log(`Cache directory is set to: ${cacheDir}`);
