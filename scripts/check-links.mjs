import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(x=>x.isDirectory()?files(path.join(dir,x.name)):path.join(dir,x.name)))).flat();}
let errors=[];
for(const file of (await files(root)).filter(x=>x.endsWith('.html'))){
 const html=await readFile(file,'utf8');
 for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
  const url=decodeURI(match[1]);if(url.startsWith('//'))continue;
  const target=path.join(root,url);
  if(!await stat(target).catch(()=>false) && !await stat(path.join(target,'index.html')).catch(()=>false))errors.push(`${path.relative(root,file)} -> ${url}`);
 }
}
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1);}
console.log('All generated internal page and asset links resolve.');
