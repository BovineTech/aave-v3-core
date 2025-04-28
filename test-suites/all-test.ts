import fs from 'fs';
import path from 'path';

const tasksPath = path.join(__dirname, '/');
fs.readdirSync(tasksPath)
  .filter((pth) => pth.includes('.ts'))
  .forEach((task) => {
    require(`${tasksPath}/${task}`);
  });
