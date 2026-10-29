import { writeFile } from 'node:fs/promises';
export function selectStable(releases) {
  return releases.filter(r => !r.draft && !r.prerelease && /^v\d+\.\d+\.\d+$/.test(r.tag_name) && Number(r.tag_name.slice(1).split('.')[0]) >= 5)
    .sort((a,b) => {
      const av=a.tag_name.slice(1).split('.').map(Number), bv=b.tag_name.slice(1).split('.').map(Number);
      return bv[0]-av[0] || bv[1]-av[1] || bv[2]-av[2];
    })[0] ?? null;
}
export async function loadReleases(fetcher = fetch) {
  const releases=[];
  for(let page=1;page<=20;page++) {
    const response=await fetcher(`https://api.github.com/repos/arfajhf/copytygo/releases?per_page=100&page=${page}`, {headers:{Accept:'application/vnd.github+json',...(process.env.GITHUB_TOKEN ? {Authorization:`Bearer ${process.env.GITHUB_TOKEN}`} : {})}});
    if(!response.ok) throw new Error(`GitHub Releases failed (${response.status}); snapshot preserved.`);
    const rows=await response.json();
    if(!Array.isArray(rows)) throw new Error('Invalid release response');
    releases.push(...rows);
    if(rows.length<100) return releases;
  }
  throw new Error('Pagination limit reached; snapshot preserved.');
}
if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
  const releases=await loadReleases();
  const stable=selectStable(releases);
  const snapshot={recommended:stable?.tag_name ?? null,checkedAt:new Date().toISOString().slice(0,10),releases:releases.filter(r=>!r.draft).map(r=>({tag:r.tag_name,url:r.html_url,publishedAt:r.published_at,prerelease:r.prerelease}))};
  await writeFile(new URL('../src/data/releases.json',import.meta.url),JSON.stringify(snapshot,null,2)+'\n');
  console.log(`Release snapshot updated: ${snapshot.recommended ?? 'no stable release'}. Review docs before changing pinned commands.`);
}
