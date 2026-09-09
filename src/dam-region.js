// Authored presentation of Flood Control Dam #3. Read-only release-119 adapter.
// Globals verified against source routines and parser-driven transitions.
export const damRooms=new Set([178,120,224,111,123,95,191]);
export function damState(engine){
 const word=i=>engine.global(i);
 const gates=!!word(56),low=engine.flag(95,6);
 return {gates,low,enabled:!!word(88),waterLevel:word(94),
   water:low?(gates?'low':'rising'):(gates?'falling':'high'),
   maintenanceLit:engine.flag(224,19),leak:!engine.flag(49,7)};
}
export const damScenes={
 178:{art:'dam-closed-high-v1',caption:'A sleeping machine above the water.',objects:[9,210,200,223],hotspots:[{id:9,x:72,y:59},{id:210,x:79,y:52},{id:200,x:80.7,y:41.8},{id:223,x:30,y:31}]},
 120:{art:'dam-atlas',cell:1,caption:'The last tour left a long time ago.',objects:[],hotspots:[]},
 224:{art:'dam-maintenance-v1',caption:'Four buttons. A long silence.',objects:[63,151,212,225,237,49],hotspots:[{ids:[225,63,151,212],label:'Wall buttons',x:54.2,y:33.7},{id:49,x:84.5,y:36}]},
 111:{art:'waterways-atlas',cell:3,caption:'The Frigid River passes beneath the dam.',objects:[],hotspots:[]},
 123:{art:'reservoir-atlas',cell:0,caption:'The southern shore of a silent lake.',objects:[],hotspots:[]},
 95:{art:'reservoir-atlas',cell:2,caption:'Between the two shores.',objects:[],hotspots:[]},
 191:{art:'reservoir-atlas',cell:1,caption:'Wet stone and a stairway north.',objects:[],hotspots:[]},
};
export const damFloorZones={
 178:[[25,84],[38,80],[51,77],[16,91],[39,92],[54,88]],
 120:[[32,82],[47,88],[63,82],[22,91],[75,90],[50,95]],
 224:[[30,81],[44,85],[59,80],[23,92],[71,90],[49,94]],
 111:[[18,82],[27,89],[37,85],[15,92],[44,92],[33,95]],
 123:[[24,84],[37,90],[49,86],[14,92],[61,92],[43,95]],
 95:[[32,85],[46,90],[59,83],[23,93],[70,91],[50,95]],
 191:[[67,83],[78,90],[57,90],[86,83],[43,94],[70,95]],
};
export function damCaption(engine,scene){
 if(!damRooms.has(engine.state().room))return scene;
 const s=damState(engine),room=engine.state().room;
 if(room===178)return {...scene,art:`dam-${s.gates?'open':'closed'}-${s.low?'low':'high'}-v1`};
 if([95,123,191].includes(room)){
  const caption={high:scene.caption,falling:'The water is falling, but the lake remains deep.',low:'Mud and a stream where the lake once lay.',rising:'The water is rising again.'}[s.water];
  return {...scene,caption,...(s.low?{art:'reservoir-dry-v1',cell:({123:0,191:1,95:2})[room]}:{})};
 }
 return scene;
}
