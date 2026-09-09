import { Engine } from './engine.js';
import { Discovery, observation } from './discovery.js';
export const QUICK_SAVE_KEY='lantern-depths.save.v1';
export const MAX_SAVE_BYTES=2_000_000;
export const SLOT_COUNT=3;
const slotKey=id=>{if(!Number.isInteger(id)||id<1||id>SLOT_COUNT)throw Error('Unknown save slot.');return `lantern-depths.slot.v1.${id}`;};
export function capture(engine,history,discovery,storyHash){
  return {format:'lantern-depths',version:2,storyHash:engine.adapter.sha256,adapter:engine.adapter.id,savedAt:new Date().toISOString(),engine:engine.snapshot(),history:structuredClone(history),discovery:structuredClone(discovery.snapshot())};
}
export function decodeSave(raw,ZVM,story,storyHash,futureEntropy,catalog){
  if(typeof raw!=='string'||new TextEncoder().encode(raw).length>MAX_SAVE_BYTES)throw Error('Save is too large.');
  const save=JSON.parse(raw);
  if(!save||typeof save!=='object')throw Error('Invalid save.');
  if(catalog){
    const found=Object.values(catalog).find(entry=>save.storyHash?entry.hash===save.storyHash:entry.signature===save.engine?.signature);
    if(!found)throw Error('This save belongs to a different story or build.');
    story=found.bytes;storyHash=found.hash;
  }
  const candidate=new Engine(ZVM,story);
  if(save.version!==undefined&&(save.format!=='lantern-depths'||save.version!==2||save.storyHash!==storyHash||save.adapter!==candidate.adapter.id))throw Error('This save belongs to a different story or build.');
  if(!Array.isArray(save.history)||save.history.length>150||!save.history.every(e=>e&&typeof e.text==='string'&&e.text.length<100_000&&typeof e.command==='string'&&e.command.length<=1000))throw Error('Invalid journal data.');
  const data=save.engine;
  if(!data||!Array.isArray(data.data)||data.data.length>200_000||!data.data.every(x=>Number.isInteger(x)&&x>=0&&x<=255)||!data.read||!Array.isArray(data.read.buffer)||data.read.buffer.length>256||!data.read.buffer.every(x=>Number.isInteger(x)&&x>=0&&x<=65535))throw Error('Invalid interpreter data.');
  const engine=candidate;engine.restore(data,futureEntropy);
  const discovery=new Discovery();discovery.restore(save.discovery);discovery.record(null,observation(engine));
  return {engine,history:save.history,discovery};
}
export function saveSlot(storage,id,name,save){
  const value={...save,label:String(name).trim().slice(0,60)||`Adventure ${id}`};
  storage.setItem(slotKey(id),JSON.stringify(value));return value;
}
export function readSlot(storage,id){return storage.getItem(slotKey(id));}
export function slotMetadata(raw){
  if(!raw)return null;
  try{const s=JSON.parse(raw);return {label:typeof s.label==='string'?s.label.slice(0,60):'Saved adventure',savedAt:typeof s.savedAt==='string'?s.savedAt:''};}catch{return {label:'Unreadable save',savedAt:''};}
}
