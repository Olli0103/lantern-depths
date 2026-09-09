// Read-only visual adapter for the pinned release 119 image.
// Global slots were verified against parser-driven state transitions.
export const globalFlag=(engine,index)=>!!engine.vm.m.getUint16(engine.vm.globals+index*2);
export function worldState(engine){
  return {
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
  if([123,191,95].includes(room)&&state.drained)return {...scene,art:'reservoir-atlas',cell:3};
  if([52,110].includes(room)&&state.mirrorBroken)return {...scene,art:'mirror-atlas',cell:1};
  return scene;
}
