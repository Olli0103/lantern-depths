// A schematic of remembered journeys, never the story's exit table.
const vectors={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0],northeast:[1,-1],northwest:[-1,-1],southeast:[1,1],southwest:[-1,1],up:[1,-1],down:[-1,1],in:[1,0],out:[-1,0]};
const short={north:'N',south:'S',east:'E',west:'W',northeast:'NE',northwest:'NW',southeast:'SE',southwest:'SW',up:'up',down:'down',in:'in',out:'out'};
export function layoutJourneys(discovery){
 const rooms=[...new Map(discovery.rooms.map(r=>[r.id,r])).values()],ids=new Set(rooms.map(r=>r.id));
 const edges=discovery.routes.filter(r=>ids.has(r.from)&&ids.has(r.to)&&r.from!==r.to&&vectors[r.direction]);
 const placed=new Map(),used=new Set();let component=0;
 function free(x,y){
  if(!used.has(`${x},${y}`))return [x,y];
  for(let radius=1;radius<=rooms.length;radius++)for(let dx=-radius;dx<=radius;dx++)for(let dy=-radius;dy<=radius;dy++)
   if(Math.max(Math.abs(dx),Math.abs(dy))===radius&&!used.has(`${x+dx},${y+dy}`))return[x+dx,y+dy];
 }
 for(const room of rooms){
  // Only a recorded incoming journey positions a new place; all other
  // components are separate. Collision offsets are schematic, not geography.
  const incoming=edges.find(r=>r.to===room.id&&placed.has(r.from));
  let x=(component%4)*2,y=Math.floor(component/4)*2;
  if(incoming){const p=placed.get(incoming.from),v=vectors[incoming.direction];x=p.col+v[0];y=p.row+v[1];}else component++;
  [x,y]=free(x,y);used.add(`${x},${y}`);placed.set(room.id,{...room,col:x,row:y});
 }
 const values=[...placed.values()],minX=Math.min(0,...values.map(r=>r.col)),minY=Math.min(0,...values.map(r=>r.row));
 const nodes=values.map(r=>({...r,x:(r.col-minX)*225+120,y:(r.row-minY)*125+65}));
 return {nodes,edges,width:Math.max(480,...nodes.map(r=>r.x+120)),height:Math.max(220,...nodes.map(r=>r.y+70))};
}
const ns='http://www.w3.org/2000/svg';
function svgEl(tag,attrs={},text){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;return el;}
function lines(name){const words=name.split(' '),out=[''];for(const w of words){let i=out.length-1;if(out[i]&&out[i].length+w.length>23){out.push(w);}else out[i]+=(out[i]?' ':'')+w;}return out;}
export function renderJourneySketch(discovery,parent,current,onLocate){
 const {nodes,edges,width,height}=layoutJourneys(discovery);if(!nodes.length)return;
 const section=document.createElement('section');section.className='journey-sketch';
 const note=document.createElement('p');note.textContent='Schematic, not geographic. Arrows show the direction you travelled.';section.append(note);
 const controls=document.createElement('div');controls.className='map-zoom';section.append(controls);
 const viewport=document.createElement('div');viewport.className='map-canvas';viewport.tabIndex=0;viewport.setAttribute('aria-label','Scrollable sketch of explored routes');section.append(viewport);
 const svg=svgEl('svg',{viewBox:`0 0 ${width} ${height}`,width,height,role:'group','aria-label':'Observed journeys'});viewport.append(svg);
 const defs=svgEl('defs'),marker=svgEl('marker',{id:'journey-arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'});marker.append(svgEl('path',{d:'M 0 1 L 9 5 L 0 9',fill:'none',stroke:'currentColor','stroke-width':1.5}));defs.append(marker);svg.append(defs);
 const index=new Map(nodes.map(n=>[n.id,n]));
 for(const edge of edges){
  const a=index.get(edge.from),b=index.get(edge.to),dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
  const trim=(dx,dy)=>1/Math.max(Math.abs(dx)/96,Math.abs(dy)/37);
  const t=trim(dx,dy),sx=a.x+dx*t,sy=a.y+dy*t,ex=b.x-dx*t,ey=b.y-dy*t;
  const bend=edges.some(r=>r.from===edge.to&&r.to===edge.from)?18:0,mx=(sx+ex)/2-dy/len*bend,my=(sy+ey)/2+dx/len*bend;
  const path=svgEl('path',{d:`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`,class:'journey-edge','marker-end':'url(#journey-arrow)','data-from':edge.from,'data-to':edge.to});path.append(svgEl('title',{},`${a.name}: ${edge.direction} → ${b.name}`));svg.append(path);
  svg.append(svgEl('text',{x:mx,y:my-7,class:'journey-direction','text-anchor':'middle'},short[edge.direction]));
 }
 for(const n of nodes){
  const here=n.id===current?.id,g=svgEl('g',{transform:`translate(${n.x},${n.y})`,role:'button',tabindex:0,'aria-label':`${n.name}${here?', you are here':''}: locate notes`,class:`journey-node${here?' current':''}`,'data-room-id':n.id});
  g.append(svgEl('rect',{x:-95,y:-36,width:190,height:72,rx:4}));const label=svgEl('text',{'text-anchor':'middle'}),parts=lines(n.name);
  parts.forEach((part,i)=>label.append(svgEl('tspan',{x:0,y:(i-(parts.length-1)/2)*17+(here?-4:4)},part)));g.append(label);
  if(here)g.append(svgEl('text',{x:0,y:26,'text-anchor':'middle',class:'journey-here'},'YOU ARE HERE'));
  g.addEventListener('click',()=>onLocate(n.id));g.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();onLocate(n.id);}});svg.append(g);
 }
 let zoom=1;const redraw=()=>{svg.style.width=`${width*zoom}px`;svg.style.height=`${height*zoom}px`;};
 for(const [label,change]of [['−',-.2],['+',.2]]){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',change>0?'Zoom in map':'Zoom out map');b.addEventListener('click',()=>{zoom=Math.max(.4,Math.min(1.8,zoom+change));redraw();});controls.append(b);}
 parent.append(section);redraw();const here=index.get(current?.id);if(here)requestAnimationFrame(()=>{viewport.scrollLeft=Math.max(0,here.x-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,here.y-viewport.clientHeight/2);});
}
