// Authored placement only. No room/puzzle memory writes, exit-table inspection or
// inferred routes. Source coordinates refer to the existing complete paintings.
export const authoredRooms=new Set([64,137,85,27,75,33,127,247,122,220,130]);
const floorZones={
  64:[[43,84],[53,79],[63,86],[34,89],[72,83],[47,93]],
  137:[[39,84],[54,88],[65,82],[28,90],[72,90],[46,94]],
  85:[[55,88],[66,83],[43,92],[73,91],[32,87],[58,95]],
  27:[[21,80],[79,84],[27,91],[85,92],[13,89],[76,95]],
  75:[[37,91],[67,92],[79,82],[87,92],[12,84],[53,96]],
  33:[[38,84],[54,89],[67,82],[26,92],[77,91],[47,95]],
  127:[[30,85],[74,86],[43,93],[83,92],[20,93],[63,96]],
  247:[[75,85],[67,91],[86,79],[84,93],[60,96],[93,88]],
  122:[[48,83],[61,89],[32,90],[74,81],[83,92],[53,95]],
  220:[[42,81],[58,87],[29,91],[69,80],[79,91],[48,95]],
  130:[[49,85],[60,91],[36,91],[72,86],[24,94],[54,96]],
};
export const localHotspots={
  27:[{id:169,x:51,y:66},{id:243,x:90,y:23},{id:43,x:55,y:32}],
  75:[{id:197,x:67,y:39},{id:100,x:10,y:41}],
};
// These are fixed in-world fixtures, never generic floor props.
const fixed=new Set([55,240,150,199,164,70,207,108,203,29,59]);
const normalWidth=id=>({92:18,41:9,227:10,36:12,99:10,138:6,146:7,14:7,217:5})[id]??8;
export function stageRegion(engine,layers){
  const room=engine.state().room;if(!authoredRooms.has(room))return layers;
  const result=layers.filter(l=>l.decorative||!engine.carried(l.id));
  let floor=0,table=0,shelf=0;
  const awaiting=[];
  for(const layer of result){
    const id=layer.id;
    if(layer.decorative||fixed.has(id))continue;
    const parent=engine.parent(id);
    // Untouched objects keep their source-authored mounting; the manual is on
    // the studio FLOOR, never attached to its paint-spattered wall.
    if(room===122&&id===92&&parent===122&&!engine.flag(id,3)){Object.assign(layer,{x:69,y:39,width:23,placement:'wall'});continue;}
    if(room===220&&id===41&&parent===220&&!engine.flag(id,3)){Object.assign(layer,{x:50,y:79,width:10,placement:'floor-paper'});continue;}
    if(room===75&&parent===75&&!engine.flag(id,3)&&[146,227].includes(id)){
      Object.assign(layer,id===146?{x:39,y:28,width:6}:{x:67,y:12,width:9});layer.placement='mounted';continue;
    }
    if(room===64&&parent===230){Object.assign(layer,{x:28,y:62,width:8,placement:'mailbox'});continue;}
    if(room===27&&parent===169){
      const pos=id===99?[43,55,12]:id===138?[61,55,8]:[[53,62,8],[70,62,7],[34,64,7],[63,66,6]][table++%4];
      Object.assign(layer,{x:pos[0],y:pos[1],width:pos[2],placement:'table'});continue;
    }
    if(room===75&&parent===197){
      const i=shelf++;Object.assign(layer,{x:60.3+(i%4)*4,y:28+Math.min(5,Math.floor(i/4))*3.8,width:Math.min(normalWidth(id),3.6),placement:'shelf'});continue;
    }
    if(parent===room){
      const i=floor++,zone=floorZones[room][i%floorZones[room].length];
      Object.assign(layer,{x:zone[0]+Math.floor(i/6)*2,y:zone[1]-Math.floor(i/6)*3,width:normalWidth(id),placement:'floor'});
    }else if([99,138].includes(parent))awaiting.push(layer);
  }
  // Contents stay by their container, not in an unrelated strip at the bottom.
  const counts=new Map();
  for(const layer of awaiting){
    const parent=engine.parent(layer.id),container=result.find(l=>l.id===parent);
    if(!container)continue;const i=counts.get(parent)??0;counts.set(parent,i+1);
    Object.assign(layer,{x:container.x+(i?1:-1)*container.width*.48,y:container.y+container.width*.25,width:Math.min(normalWidth(layer.id),container.width*.52),placement:'contents'});
  }
  return result;
}
