import fs from 'fs';
import path from 'path';

const filePath = path.resolve('dist/server.js');

let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(/\.\/src\/index\.js/g, './index.js');

fs.writeFileSync(filePath, content, 'utf-8');

console.log(`Import references in ${filePath} fixed successfully.`);
