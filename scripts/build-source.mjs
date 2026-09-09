// Rebuild unmodified pinned ZIL in isolation; never overwrite the public story.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
const platforms={
  'darwin-arm64':['osx-arm64','a5bd632e80d03a5037d1ce04b4cdd55af938498010f37cf0ab4995b7d1125629'],
  'linux-x64':['linux-x64','06ff0e59eff6e6896fd9ce71d16c100365abbc537cf030f2bd31beb9384d0155'],
  'linux-arm64':['linux-arm64','adca948db3c0971b24d2002245e77a0321c072c9f62fb97945b7a874f7be6ed5'],
};
const target=platforms[`${process.platform}-${process.arch}`];
if(!target)throw Error('Supported build hosts: macOS arm64, Linux x64/arm64.');
const [platform,digest]=target,archive=`.tools/zilf-1.9.0-${platform}.tar.gz`,toolDir=`.tools/zilf-1.9.0-${platform}`;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
mkdirSync('.tools',{recursive:true});
if(!existsSync(archive))execFileSync('curl',['--fail','--location','--silent','--show-error',`https://github.com/taradinoc/zilf/releases/download/1.9/zilf-1.9.0-${platform}.tar.gz`,'-o',archive],{stdio:'inherit'});
if(hash(readFileSync(archive))!==digest)throw Error('ZILF archive checksum mismatch.');
mkdirSync(toolDir,{recursive:true});execFileSync('tar',['-xzf',archive,'-C',toolDir,'--strip-components=1']);
const compiler=resolve(toolDir,'bin/zilf');
function build(dir){
  mkdirSync(dir,{recursive:true});
  for(const f of readdirSync('vendor/zork1').filter(f=>f.endsWith('.zil')))copyFileSync(`vendor/zork1/${f}`,`${dir}/${f}`);
  execFileSync(compiler,['build',`${dir}/zork1.zil`,`${dir}/rebuilt.z3`,'--asm-options=-s,000000,-r,0'],{stdio:'inherit'});
  return hash(readFileSync(`${dir}/rebuilt.z3`));
}
const first=build('build/source-a'),second=build('build/source-b');
if(first!==second)throw Error('Independent source builds differ.');
const provenance=JSON.parse(readFileSync('docs/upstream.json'));
writeFileSync('build/source-report.json',JSON.stringify({compiler:'ZILF 1.9',platform,archiveSha256:digest,sourceCommit:provenance.commit,sourceModified:false,serial:'000000',release:0,storySha256:first,reproducible:true,publicStoryChanged:false},null,2)+'\n');
console.log(`Reproducible source build: ${first}. Public story and saves unchanged.`);
