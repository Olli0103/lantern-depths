import {worldState} from './world-state.js';
export const props={"10":{"art":"treasures-atlas","index":0},"12":{"art":"equipment-atlas","index":0},"14":{"art":"equipment-atlas","index":1},"17":{"art":"equipment-atlas","index":2},"23":{"art":"treasures-atlas","index":1},"24":{"art":"world-objects-atlas","index":0},"26":{"art":"equipment-atlas","index":3},"29":{"art":"encounters-atlas","index":5},"58":{"art":"equipment-atlas","index":4},"59":{"art":"encounters-atlas","index":12},"60":{"art":"equipment-atlas","index":5},"68":{"art":"world-objects-atlas","index":1},"70":{"art":"encounters-atlas","index":4},"80":{"art":"treasures-atlas","index":2},"83":{"art":"encounters-atlas","index":10},"91":{"art":"world-objects-atlas","index":2},"96":{"art":"equipment-atlas","index":6},"97":{"art":"treasures-atlas","index":3},"105":{"art":"treasures-atlas","index":4},"108":{"art":"encounters-atlas","index":9},"109":{"art":"equipment-atlas","index":7},"114":{"art":"equipment-atlas","index":8},"115":{"art":"world-objects-atlas","index":3},"119":{"art":"treasures-atlas","index":5},"126":{"art":"treasures-atlas","index":6},"132":{"art":"equipment-atlas","index":9},"133":{"art":"treasures-atlas","index":7},"135":{"art":"equipment-atlas","index":10},"136":{"art":"world-objects-atlas","index":4},"140":{"art":"treasures-atlas","index":8},"142":{"art":"world-objects-atlas","index":5},"149":{"art":"world-objects-atlas","index":6},"154":{"art":"treasures-atlas","index":9},"157":{"art":"equipment-atlas","index":11},"163":{"art":"world-objects-atlas","index":7},"164":{"art":"encounters-atlas","index":2},"165":{"art":"world-objects-atlas","index":8},"168":{"art":"encounters-atlas","index":11},"179":{"art":"treasures-atlas","index":10},"180":{"art":"world-objects-atlas","index":9},"181":{"art":"equipment-atlas","index":12},"185":{"art":"equipment-atlas","index":13},"192":{"art":"treasures-atlas","index":11},"195":{"art":"equipment-atlas","index":14},"196":{"art":"world-objects-atlas","index":10},"199":{"art":"encounters-atlas","index":0},"201":{"art":"treasures-atlas","index":12},"203":{"art":"encounters-atlas","index":9},"204":{"art":"treasures-atlas","index":13},"207":{"art":"encounters-atlas","index":7},"208":{"art":"world-objects-atlas","index":11},"214":{"art":"treasures-atlas","index":14},"215":{"art":"world-objects-atlas","index":12},"217":{"art":"world-objects-atlas","index":13},"219":{"art":"world-objects-atlas","index":14},"229":{"art":"world-objects-atlas","index":15},"232":{"art":"world-objects-atlas","index":8},"236":{"art":"equipment-atlas","index":15},"242":{"art":"treasures-atlas","index":15},"246":{"art":"world-objects-atlas","index":8},"cyclops-asleep":{"art":"encounters-atlas","index":1},"thief-down":{"art":"encounters-atlas","index":3},"grate-open":{"art":"encounters-atlas","index":6},"machine-open":{"art":"encounters-atlas","index":8},"bell-hot":{"art":"encounters-atlas","index":11},"wall-hole":{"art":"encounters-atlas","index":13},"rope-tied":{"art":"encounters-atlas","index":14},"ghosts":{"art":"encounters-atlas","index":15}};
export function propStyle(engine,id,el){
  let key=id;
  if(id===207&&engine.flag(id,11))key='machine-open';
  if(id===29&&engine.flag(id,11))key='grate-open';
  if(id===199&&worldState(engine).cyclopsSleeping)key='cyclops-asleep';
  if(id===164&&engine.vm.get_prop(164,7)>32767)key='thief-down';
  if(id===58&&worldState(engine).ropeTied)key='rope-tied';
  const p=props[key];if(!p)return;
  el.classList.add('world-prop');el.style.backgroundImage=`url(./art/${p.art}.png)`;
  el.style.backgroundSize='400% 400%';el.style.backgroundPosition=`${(p.index%4)*100/3}% ${Math.floor(p.index/4)*100/3}%`;
  el.style.aspectRatio='1';el.dataset.artState=String(key);
}
const staged={199:[57,64,42],164:[62,64,32],70:[50,23,25],207:[52,68,38],108:[60,71,22],203:[51,79,22],157:[51,82,34],29:[51,80,33],179:[50,76,30],135:[54,75,23],12:[50,54,12]};
export function propLayers(engine){
  if(!engine.lit())return[];
  const room=engine.state().room,layers=[];let floor=0;
  for(const raw of Object.keys(props)){
    const id=Number(raw);if(!Number.isFinite(id)||!engine.visible(id)||engine.parent(id)===44||id===59)continue;
    let parent=engine.parent(id),held=false;const seen=new Set();
    while(parent&&parent!==room&&!seen.has(parent)){if(parent===44){held=true;break;}seen.add(parent);parent=engine.parent(parent);}
    if(held)continue;
    const special=!engine.flag(id,3)&&staged[id]||([199,164,70,207,108,203].includes(id)?staged[id]:null);
    const [x,y,width]=special??[18+(floor%7)*10,80+Math.floor(floor++/7)*7,[23,132,181].includes(id)?13:9];
    layers.push({id,x,y,width,prop:true});
  }
  const state=worldState(engine);
  const egg=layers.find(x=>x.id===105),nest=layers.find(x=>x.id===135);
  if(egg&&nest&&engine.parent(105)===135){Object.assign(egg,{x:nest.x,y:nest.y-2,width:9});layers.splice(layers.indexOf(egg),1);layers.push(egg);}
  const rope=layers.find(x=>x.id===58);
  if(rope&&state.ropeTied)Object.assign(rope,{x:41,y:61,width:53});
  if(room===78&&state.cyclopsPassage)layers.push({id:'wall-hole',x:75,y:50,width:30,prop:true,decorative:true});
  if(room===38&&engine.visible(211))layers.push({id:'ghosts',x:51,y:59,width:45,prop:true,decorative:true});
  if([160,216].includes(room)&&(room===216||!engine.flag(29,7)))layers.push({id:29,x:51,y:room===216?24:80,width:33,prop:true});
  if([47,125,202].includes(room)&&state.rainbow)layers.push({id:59,x:52,y:58,width:95,prop:true});
  return layers;
}
