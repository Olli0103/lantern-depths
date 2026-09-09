import manifest from '../build/art-manifest.json' with { type: 'json' };
export function setPaintingSource(source,id,atlas=false){
  const asset=manifest[id];
  if(!asset){source.removeAttribute('srcset');return;}
  source.srcset=asset.variants.map(v=>`./art/webp/${v.file} ${v.width}w`).join(', ');
  // A clipped atlas is twice the displayed room width: preserve its cell detail.
  source.sizes=atlas?'(max-width: 760px) 200vw, 150vw':'(max-width: 760px) 100vw, 75vw';
}
export function propImage(id){
  const asset=manifest[id];const webp=asset?.variants.at(-1)?.file;
  return webp?`url("./art/webp/${webp}")`:`url("./art/${id}.png")`;
}
