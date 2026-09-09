import { nouns } from './scenes.js';

export const noun = (engine, id) => nouns[id] ?? engine.name(id);

// Affordances, not solutions: only general physical verbs derived from object flags.
export function actionsFor(engine, id) {
  const held = engine.parent(id) === 44;
  const actions = ['Examine'];
  if (engine.flag(id, 17)) actions.push(held ? 'Drop' : 'Take');
  if (engine.flag(id, 18) || engine.flag(id, 22)) actions.push(engine.flag(id, 11) ? 'Close' : 'Open');
  if (engine.flag(id, 16)) actions.push('Read');
  if (engine.flag(id, 31)) actions.push(engine.flag(id, 19) ? 'Turn off' : 'Turn on');
  if([63,151,212,225].includes(id))actions.push('Push');
  if(id===195)actions.push('Squeeze');
  if (!held) actions.push('Move');
  return actions;
}

export const relations = {
  turn: { label: 'Turn with…', command: (item,target)=>`turn ${target} with ${item}` },
  in: { label: 'Put in…', command: (item, target) => `put ${item} in ${target}` },
  on: { label: 'Put on…', command: (item, target) => `put ${item} on ${target}` },
  give: { label: 'Give to…', command: (item, target) => `give ${item} to ${target}` },
  unlock: { label: 'Unlock with…', command: (item, target) => `unlock ${target} with ${item}` },
  attack: { label: 'Attack with…', command: (item, target) => `attack ${target} with ${item}` },
};

export function visualState(engine) {
  return {
    room: engine.state().room,
    lit: engine.lit(),
    mailboxOpen: engine.flag(230, 11),
    windowOpen: engine.flag(243, 11),
    rugMoved: !engine.flag(240, 7),
    trapOpen: engine.flag(240, 11),
    lampOn: engine.flag(146, 19),
    inventory: engine.inventory().map(item => item.id),
  };
}

export function changedSounds(before, after) {
  const sounds = [];
  if (before.room !== after.room) sounds.push('step');
  if (before.mailboxOpen !== after.mailboxOpen || before.windowOpen !== after.windowOpen || before.trapOpen !== after.trapOpen) sounds.push('wood');
  if (before.rugMoved !== after.rugMoved) sounds.push('scrape');
  if (before.lampOn !== after.lampOn) sounds.push('click');
  if (after.inventory.some(id => !before.inventory.includes(id)) || before.inventory.some(id => !after.inventory.includes(id))) sounds.push('take');
  return sounds;
}
