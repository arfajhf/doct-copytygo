import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(x=>x.isDirectory()?files(path.join(dir,x.name)):path.join(dir,x.name)))).flat();}
const htmlFiles=(await files(root)).filter(x=>x.endsWith('.html'));
const cache=new Map(await Promise.all(htmlFiles.map(async file=>[file,await readFile(file,'utf8')])));
const errors=[];
for(const [file,html] of cache){
 const pageUrl=new URL(path.relative(root,file).replace(/index\.html$/,''),'http://localhost/');
 for(const match of html.matchAll(/(?:href|src)="([^\"]+)"/g)){
  if(!match[1].startsWith('/')&&!match[1].startsWith('#'))continue;
  const url=new URL(match[1],pageUrl);
  if(url.origin!==pageUrl.origin)continue;
  let target=path.join(root,decodeURIComponent(url.pathname));
  const info=await stat(target).catch(()=>null);
  if(info?.isDirectory())target=path.join(target,'index.html');
  if(!await stat(target).catch(()=>null)){errors.push(`${path.relative(root,file)} -> ${match[1]}`);continue;}
  if(url.hash&&target.endsWith('.html')){
   const targetHtml=cache.get(target)??await readFile(target,'utf8');
   if(!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))errors.push(`${path.relative(root,file)} -> missing anchor ${match[1]}`);
  }
 }
}
const search=JSON.parse(await readFile(path.join(root,'search-index.json'),'utf8'));
for(const item of search){
 const url=new URL(item.route,'http://localhost');
 const html=cache.get(path.join(root,url.pathname,'index.html'));
 if(!html||(url.hash&&!html.includes(`id="${url.hash.slice(1)}"`)))errors.push(`search index -> ${item.route}`);
}
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1);}
console.log(`Verified ${htmlFiles.length} HTML pages, internal links/assets, heading anchors and ${search.length} search targets.`);
