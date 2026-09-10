import manifest from '../build/art-manifest.json' with { type: 'json' };
export const hasPainting=id=>!!manifest[id];
export function setPaintingSource(source,id,atlas=false){
  const asset=manifest[id];
  if(!asset){source.removeAttribute('srcset');return;}
  source.srcset=asset.variants.map(v=>`./art/webp/${v.file} ${v.width}w`).join(', ');
  // A clipped atlas is twice the displayed room width: preserve its cell detail.
  // Desktop paintings are capped by viewport height (see ui.css --scene-max-height).
  const desk='min(75vw, calc(max(380px, 100dvh - 440px) * 1.5))';
  source.sizes=atlas?`(max-width: 760px) 200vw, calc(${desk} * 2)`:`(max-width: 760px) 100vw, ${desk}`;
}
export function propImage(id){
  const asset=manifest[id];const webp=asset?.variants.at(-1)?.file;
  return webp?`url("./art/webp/${webp}")`:`url("./art/${id}.png")`;
}
