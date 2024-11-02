const express = require('express');
const http = require('http');
const { Command } = require('commander');
const path = require('path');

// ����������� Commander.js
const program = new Command();

program
  .requiredOption('-h, --host <host>', 'Server address')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Path to cache directory')
  .parse(process.argv);

const options = program.opts();

// ��������� ���-������� � Express
const app = express();
const server = http.createServer(app);

// ������ ����� �� ������ ����� �� �����
server.listen(options.port, options.host, () => {
  console.log(`Server is running at http://${options.host}:${options.port}`);
});

// ������� ���� ��� ����������
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// �������� ��������� �������� ����
const cacheDir = path.resolve(options.cache);
console.log(`Cache directory is set to: ${cacheDir}`);
