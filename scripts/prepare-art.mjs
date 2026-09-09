import sharp from 'sharp';
import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const out='public/art/webp';mkdirSync(out,{recursive:true});
const manifestPath=`${out}/manifest.json`;
const old=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath)):{};
const manifest={};let sourceBytes=0,deliveredBytes=0;
const recipe='sharp-0.35.4-webp-q82-alpha-lossless-v1';
for(const name of readdirSync('public/art').filter(n=>n.endsWith('.png')).sort()){
  const file=`public/art/${name}`,id=name.slice(0,-4),bytes=readFileSync(file),hash=createHash('sha256').update(bytes).digest('hex');
  const cached=old[id];
  if(cached?.hash===hash&&cached.recipe===recipe&&cached.variants.every(v=>existsSync(`${out}/${v.file}`)))manifest[id]=cached;
  else {
    const meta=await sharp(bytes).metadata();const alpha=meta.hasAlpha;
    const widths=alpha?[meta.width]:[...new Set([Math.min(768,meta.width),meta.width])];
    const variants=[];
    for(const width of widths){
      const filename=alpha?`${id}.webp`:`${id}-${width}.webp`;
      const image=sharp(bytes);if(width!==meta.width)image.resize({width,withoutEnlargement:true});
      const result=await image.webp(alpha?{lossless:true,effort:4}:{quality:82,effort:4}).toBuffer();
      writeFileSync(`${out}/${filename}`,result);variants.push({file:filename,width,bytes:result.length});
    }
    manifest[id]={hash,recipe,width:meta.width,height:meta.height,alpha,sourceBytes:bytes.length,variants};
  }
  sourceBytes+=bytes.length;deliveredBytes+=manifest[id].variants.at(-1).bytes;
}
writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
mkdirSync('build',{recursive:true});writeFileSync('build/art-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Art: ${(sourceBytes/1e6).toFixed(1)} MB PNG → ${(deliveredBytes/1e6).toFixed(1)} MB full-resolution WebP (${Math.round((1-deliveredBytes/sourceBytes)*100)}% smaller). Originals retained; mobile environment variants separate.`);
