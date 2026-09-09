import { setPaintingSource } from './art.js';

// Never apply a new atlas crop to pixels from the previous room. Conceal the
// image and its object overlays until the matching image has decoded; a token
// prevents a late load from revealing a room already left (or darkness).
const requests = new WeakMap();
export function updatePainting(scene, source, image, art, cell, name) {
  image.alt = art ? `Painted view of ${name}` : '';
  const key = JSON.stringify([art, cell ?? null]);
  if (requests.get(image)?.key === key) return;
  const request = { key };
  requests.set(image, request);
  scene.dataset.painting = art ? 'loading' : 'empty';
  image.style.visibility = 'hidden';
  image.hidden = !art;
  if (!art) {
    source.removeAttribute('srcset');
    image.removeAttribute('src');
    image.alt = '';
    return;
  }
  Object.assign(image.style, cell === undefined
    ? { width:'100%', height:'100%', position:'', left:'', top:'' }
    : { width:'200%', height:'200%', position:'absolute', left:`${-(cell%2)*100}%`, top:`${-Math.floor(cell/2)*100}%` });
  setPaintingSource(source, art, cell !== undefined);
  image.src = `./art/${art}.png`;
  image.alt = `Painted view of ${name}`;
  image.decode().then(() => {
    if (requests.get(image) !== request) return;
    image.style.visibility = 'visible';
    scene.dataset.painting = 'ready';
  }).catch(() => {
    if (requests.get(image) !== request) return;
    scene.dataset.painting = 'error';
    requests.delete(image); // Allow a subsequent Look to retry.
  });
}
