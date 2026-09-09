import {renderJourneySketch} from './route-sketch.js';
// Knowledge only. Never inspect the world exit table or infer reverse routes.
const ambiguous=new Set(['Maze','Coal Mine','Forest','Cave','Mirror Room','Dead End','Frigid River','White Cliffs Beach','Clearing']);
const directions={n:'north',s:'south',e:'east',w:'west',ne:'northeast',nw:'northwest',se:'southeast',sw:'southwest',u:'up',d:'down',north:'north',south:'south',east:'east',west:'west',northeast:'northeast',northwest:'northwest',southeast:'southeast',southwest:'southwest',up:'up',down:'down',in:'in',out:'out'};
export const observation=engine=>engine.lit()?{id:engine.state().room,name:engine.state().name}:null;
export class Discovery {
  rooms=[];routes=[];
  record(before,after,command=''){
    if(!after||ambiguous.has(after.name))return;
    if(!this.rooms.some(r=>r.id===after.id))this.rooms.push(after);
    const direction=directions[command.trim().toLowerCase()];
    if(!before||ambiguous.has(before.name)||!direction||before.id===after.id||!this.rooms.some(r=>r.id===before.id))return;
    if(!this.routes.some(r=>r.from===before.id&&r.to===after.id&&r.direction===direction))this.routes.push({from:before.id,to:after.id,direction});
  }
  snapshot(){return {version:1,rooms:this.rooms,routes:this.routes};}
  restore(data){
    if(!data)return;
    if(data.version!==1||!Array.isArray(data.rooms)||data.rooms.length>250||!Array.isArray(data.routes)||data.routes.length>3000)throw Error('Invalid discovery notes.');
    if(!data.rooms.every(r=>Number.isInteger(r.id)&&r.id>0&&r.id<=250&&typeof r.name==='string'&&r.name.length<100&&!ambiguous.has(r.name)))throw Error('Invalid mapped room.');
    const ids=new Set(data.rooms.map(r=>r.id));
    if(!data.routes.every(r=>ids.has(r.from)&&ids.has(r.to)&&Object.values(directions).includes(r.direction)))throw Error('Invalid mapped route.');
    this.rooms=structuredClone(data.rooms);this.routes=structuredClone(data.routes);
  }
}
export function renderDiscovery(discovery,parent,current){
  parent.replaceChildren();
  const heading=document.createElement('p');heading.textContent='Observed journeys only. Mazes remain uncharted; selecting a place opens notes, never travels.';parent.append(heading);
  if(!discovery.rooms.length){const p=document.createElement('p');p.textContent='No distinct locations recorded yet.';parent.append(p);return;}
  renderJourneySketch(discovery,parent,current,id=>{const card=parent.querySelector(`[data-notes-id="${id}"]`);card?.focus({preventScroll:true});card?.scrollIntoView({block:'nearest'});});
  const list=document.createElement('div');list.className='discovery-grid';parent.append(list);
  for(const room of discovery.rooms){
    const card=document.createElement('section');card.className='discovery-room';card.dataset.notesId=room.id;card.tabIndex=-1;
    const h=document.createElement('h3');h.textContent=room.name+(current?.id===room.id?' · you are here':'');card.append(h);
    const routes=discovery.routes.filter(r=>r.from===room.id);
    for(const route of routes){const p=document.createElement('p');p.textContent=`${route.direction} → ${discovery.rooms.find(r=>r.id===route.to).name}`;card.append(p);}
    if(!routes.length){const p=document.createElement('p');p.textContent='No onward route recorded.';card.append(p);}list.append(card);
  }
}
