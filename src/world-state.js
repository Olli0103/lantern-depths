import { damRooms,damCaption } from './dam-region.js';
// Read-only visual adapter for the pinned release 119 image.
// Global slots were verified against parser-driven state transitions.
export const globalFlag=(engine,index)=>!!engine.global(index);
export function worldState(engine){
  return {
    excavation:engine.global(62),
    cyclopsSleeping:globalFlag(engine,10),
    drained:engine.flag(95,6),
    mirrorBroken:globalFlag(engine,35),
    gatesOpen:globalFlag(engine,56),
    cyclopsPassage:globalFlag(engine,87),
    ropeTied:globalFlag(engine,99),
    rainbow:globalFlag(engine,108),
  };
}
export function sceneVariant(engine,scene){
  if(!scene)return scene;
  const room=engine.state().room,state=worldState(engine);
  if(room===244&&engine.completed())return {...scene,art:'barrow-ending-v1',cell:undefined,caption:'A great and perilous adventure.',hotspots:[],ending:true};
  if(room===117)return {...scene,art:'strange-passage-v2',cell:undefined};
  if(room===205)return {...scene,art:'loud-room-v1',cell:undefined};
  if(room===129)return {...scene,art:'altar-hero-v1',cell:undefined};
  if(room===245)return {...scene,art:'shaft-hero-v1',cell:undefined};
  if(room===249)return {...scene,art:engine.parent(108)===249?'drafty-lowered-v1':'drafty-raised-v1',cell:undefined};
  if(room===155)return {...scene,art:'excavation-states-v1',cell:Math.max(0,Math.min(3,state.excavation+1))};
  if(damRooms.has(room))return damCaption(engine,scene);
  if([52,110].includes(room)&&state.mirrorBroken)return {...scene,art:'mirror-atlas',cell:1};
  return scene;
}
