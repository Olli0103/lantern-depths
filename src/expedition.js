// Authored presentation for release 119. Coordinates follow the decoded plates;
// every object still passes normal VM visibility. No exit discovery or VM writes.
export const expeditionGroups={
 temple:[2,129,241,4,11,18,38,13],
 river:[37,45,53,174,182,166,184,30,155,40,67,86,47,125,202],
 mine:[188,3,90,112,173,16,72,8,249,245,89,46,171,235,31,156],
 endgame:[78,82,117,244],
};
export const expeditionRooms=new Set(Object.values(expeditionGroups).flat());
const captions={
 2:'Marble pillars keep an older silence.',129:'A bare altar at the southern end of the temple.',241:'Time rests heavily in this chamber.',4:'Faded murals remember another world.',
 11:'A wooden railing above an immense drop.',18:'A white pedestal beneath the dome.',38:'A threshold between the living and the dead.',13:'A silence beyond the reach of time.',
 37:'The current carries on.',45:'The current carries on.',53:'The current carries on.',174:'The current carries on.',182:'The current carries on.',166:'A narrow margin between cliff and river.',184:'A narrow margin between cliff and river.',30:'Sand beneath the white cliffs.',155:'The river sounds distant beneath the stone.',40:'Solid ground beside cold water.',67:'A small stream threads the stone.',86:'Close banks beside a quiet current.',47:'Spray rises from the falling water.',125:'Mist hangs over the edge of the canyon.',202:'High above the canyon.',
 188:'The workings disappear into coal-dark stone.',3:'Narrow passages through the coal.',90:'Narrow passages through the coal.',112:'Narrow passages through the coal.',173:'Narrow passages through the coal.',16:'A long ladder vanishes below.',72:'The ladder rises into the shaft.',8:'Rough timber and a narrow passage.',249:'A draught moves through the shaft.',245:'A heavy iron chain hangs from the framework.',89:'An abandoned machine waits in the stone.',46:'Still air in a small chamber.',171:'Small sounds disturb the silence.',235:'A low ceiling in the darkness.',31:'Smooth metal slopes into the dark.',156:'The passage ends here.',
 78:'Rough walls beneath a heavy ceiling.',82:'A hideout carved into the rock.',117:'A narrow passage through the stone.',244:'An ancient threshold at the forest’s edge.',
};
export const expeditionHotspots={
 2:[{id:71,x:77,y:40}],129:[{id:35,x:51,y:50}],11:[{id:57,x:40,y:67}],18:[{id:79,x:50,y:68}],
 38:[{id:211,x:50,y:48}],155:[{id:131,x:62,y:80}],89:[{id:101,x:68,y:64}],244:[{id:190,x:54,y:53}],
};
export function expeditionScene(room,scene){
 if(!expeditionRooms.has(room))return scene;
 return {...scene,caption:captions[room],hotspots:expeditionHotspots[room]??[],objects:[]};
}
export function expeditionChapter(room){
 if(expeditionGroups.temple.includes(room))return 'THE OLD TEMPLE';
 if(expeditionGroups.river.includes(room))return 'THE FRIGID RIVER';
 if(expeditionGroups.mine.includes(room))return 'THE COAL MINES';
 if(expeditionGroups.endgame.includes(room))return room===244?'THE STONE BARROW':'HIDDEN CHAMBERS';
 return null;
}
// Six safe points on the visible surface, kept away from pits and open water.
const stone=[[30,82],[44,88],[59,82],[73,89],[21,92],[56,94]];
export const expeditionFloorZones=Object.fromEntries([...expeditionRooms].map(room=>[room,stone]));
Object.assign(expeditionFloorZones,{
 11:[[14,66],[21,75],[29,87],[12,84],[36,92],[20,92]],
 245:[[17,82],[28,90],[69,88],[82,80],[77,94],[16,93]],
 166:[[63,81],[74,87],[85,82],[53,91],[70,95],[87,94]],
 184:[[63,81],[74,87],[85,82],[53,91],[70,95],[87,94]],
 30:[[41,81],[55,86],[68,82],[78,90],[31,93],[54,94]],
});
const mounts={
 2:{83:[44,77,8]},129:{26:[43,39,7],196:[56,40,10]},241:{179:[51,76,30]},4:{23:[49,78,19]},
 18:{12:[50,57,14]},13:{140:[79,80,8]},155:{126:[60,82,8]},30:{132:[62,84,19]},
 235:{10:[67,77,9]},46:{214:[54,84,8]},8:{181:[42,84,22]},156:{60:[50,83,17]},
 82:{242:[40,81,10]},
};
// Runs after generic floor placement. Contents attach only to their actually
// visible parent; the remote basket is deliberately small, with no fake contents.
export function stageExpedition(engine,layers){
 const room=engine.state().room;if(!expeditionRooms.has(room))return layers;
 for(const layer of layers){
  if(layer.decorative)continue;
  const {id}=layer,parent=engine.parent(id);let point;
  if(mounts[room]?.[id]&&!engine.flag(id,3))point=mounts[room][id];
  if(id===207)point=[51,70,38];
  if(id===108)point=room===245?[56,71,21]:[55,73,24];
  if(id===203)point=room===245?[56,79,8]:[55,15,8];
  if([208,219,68].includes(id))point=[61,83,id===208?34:23];
  if(id===185&&[37,45,53,174,182].includes(room))point=[69,68,10];
  if(point)Object.assign(layer,{x:point[0],y:point[1],width:point[2],placement:'regional'});
 }
 for(const layer of layers){
  if(layer.decorative)continue;
  const parent=engine.parent(layer.id);
  if(parent===164){const thief=layers.find(l=>l.id===164);if(thief)Object.assign(layer,{x:thief.x+7,y:thief.y+3,width:7,placement:'held'});continue;}
  if(parent===35){const siblings=layers.filter(l=>!l.decorative&&engine.parent(l.id)===35),i=siblings.indexOf(layer);Object.assign(layer,{x:50+(i-(siblings.length-1)/2)*7,y:40,width:Math.min(10,24/Math.max(1,siblings.length)),placement:'altar'});continue;}
  if(parent===79){Object.assign(layer,{x:50,y:57,width:14,placement:'pedestal'});continue;}
  if(![108,207,179,185,105,115,208].includes(parent))continue;
  const anchor=layers.find(l=>l.id===parent);if(!anchor)continue;
  const siblings=layers.filter(l=>!l.decorative&&engine.parent(l.id)===parent),index=siblings.indexOf(layer),cols=Math.max(2,Math.ceil(Math.sqrt(siblings.length)));
  Object.assign(layer,{x:anchor.x+(index%cols-(cols-1)/2)*anchor.width*.22,y:anchor.y-anchor.width*(parent===207?.1:.3)-Math.floor(index/cols)*anchor.width*.16,width:Math.min(8,anchor.width*.28),placement:'container'});
 }
 return layers;
}
export function expeditionStates(engine){
 if(!engine.lit())return [];
 const room=engine.state().room,out=[];
 if(room===89)out.push(`Machine · ${engine.flag(207,11)?'open':'closed'}`);
 if([245,249].includes(room))out.push(`Basket · ${engine.parent(108)===room?'within reach':'at the other end of the shaft'}`);
 if(engine.visible(26))out.push(`Candles · ${engine.flag(26,19)?'lit':'unlit'}`);
 return out;
}
