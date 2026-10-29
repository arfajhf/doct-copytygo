import { test } from 'node:test';
import assert from 'node:assert/strict';
import {selectStable,loadReleases} from '../scripts/sync-releases.mjs';
test('stable recommendation sorts semver and excludes prelaunch, drafts and prereleases',()=>{
 const releases=[{tag_name:'v4.99.0'},{tag_name:'v5.2.0'},{tag_name:'v5.10.0'},{tag_name:'v6.0.0',draft:true},{tag_name:'v7.0.0',prerelease:true},{tag_name:'v8.0.0-rc.1'}];
 assert.equal(selectStable(releases).tag_name,'v5.10.0');
 assert.equal(selectStable([{tag_name:'v4.0.6'}]),null);
 assert.equal(selectStable([{tag_name:'v10.0.0'},{tag_name:'v9.9.9'}]).tag_name,'v10.0.0');
});
test('API failure fails without silently replacing snapshot', async()=>{
 await assert.rejects(loadReleases(async()=>({ok:false,status:403})),/snapshot preserved/);
});
test('release pagination fetches subsequent pages',async()=>{
 let calls=0;
 const rows=Array.from({length:100},()=>({tag_name:'v5.0.0'}));
 const releases=await loadReleases(async()=>({ok:true,json:async()=> ++calls===1 ? rows : [{tag_name:'v5.1.0'}]}));
 assert.equal(calls,2);assert.equal(releases.length,101);
});
