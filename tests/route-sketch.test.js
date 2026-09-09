import test from 'node:test';import assert from 'node:assert/strict';import{Discovery}from'../src/discovery.js';import{layoutJourneys}from'../src/route-sketch.js';
test('drawn routes contain exactly observed directed connections, not inferred returns or unknown destinations',()=>{
 const d=new Discovery();d.record(null,{id:64,name:'West of House'});d.record({id:64,name:'West of House'},{id:137,name:'North of House'},'n');d.record({id:137,name:'North of House'},{id:85,name:'Behind House'},'e');
 d.record({id:85,name:'Behind House'},{id:77,name:'Maze'},'s');
 const s=layoutJourneys(d);assert.deepEqual(s.edges,d.routes);assert.equal(s.edges.length,2);assert.deepEqual(s.nodes.map(n=>n.id),[64,137,85]);assert.ok(!s.edges.some(e=>e.from===137&&e.to===64));
 assert.ok(s.nodes[1].y<s.nodes[0].y);assert.ok(s.nodes[2].x>s.nodes[1].x);
});
test('cyclic and conflicting recorded routes retain separate nodes and all recorded edges',()=>{
 const d={rooms:[{id:1,name:'A'},{id:2,name:'B'},{id:3,name:'C'},{id:4,name:'D'}],routes:[{from:1,to:2,direction:'east'},{from:1,to:3,direction:'east'},{from:3,to:1,direction:'down'}]};const s=layoutJourneys(d);assert.equal(new Set(s.nodes.map(n=>`${n.x},${n.y}`)).size,4);assert.deepEqual(s.edges,d.routes);assert.equal(s.nodes.length,4);
 const saved=structuredClone(d);assert.deepEqual(layoutJourneys(d),layoutJourneys(saved));assert.deepEqual(d,saved);
});
