// Authored against decoded shared paintings. Identical maze/forest rooms retain
// identical anchors and captions: this adds no navigational landmarks.
const profiles={
 'surface-atlas':[
 ['Weathered boards face the southern light.',[[35,83],[49,89],[64,83],[76,91],[23,92],[56,95]]],
 ['Dust settles under the rafters.',[[20,80],[33,85],[44,92],[17,92],[52,88],[30,95]]],
 ['Branches arch above the forest path.',[[41,79],[51,86],[64,91],[32,90],[47,94],[70,84]]],
 ['Leaves move around the high branches.',[[54,80],[62,76],[71,71],[78,66],[48,84],[85,62]]]],
 'forest-atlas':[
 ['The trees offer few landmarks.',[[36,81],[49,88],[62,85],[72,91],[26,93],[55,95]]],
 ['A break in the canopy.',[[29,82],[42,88],[56,82],[70,89],[22,94],[57,95]]],
 ['The passage ends in rough stone.',[[30,82],[44,88],[60,82],[73,90],[22,94],[57,95]]],
 ['Twisting passages, all alike.',[[30,82],[44,88],[60,82],[73,90],[22,94],[57,95]]]],
 'canyon-atlas':[
 ['The landscape falls away beneath the trees.',[[16,77],[25,82],[35,88],[16,91],[39,94],[27,96]]],
 ['Stone narrows to a ledge.',[[18,77],[29,82],[39,88],[20,93],[47,94],[34,96]]],
 ['The river runs between the canyon walls.',[[69,80],[79,87],[89,80],[61,91],[77,94],[89,94]]],
 ['A deep divide beneath the earth.',[[15,77],[24,83],[36,88],[17,93],[47,94],[31,96]]]],
 'caves-atlas':[
 ['Water beads on the rock.',[[31,82],[45,88],[61,83],[74,90],[22,94],[56,95]]],
 ['Rough stone surrounds the descending steps.',[[17,78],[26,85],[38,91],[15,92],[48,95],[29,96]]],
 ['Old marks cover the cave walls.',[[31,82],[45,88],[61,83],[74,90],[22,94],[56,95]]],
 ['Still air hangs close to the stone.',[[31,82],[45,88],[61,83],[74,90],[22,94],[56,95]]]],
 'passages-two-atlas':[
 ['The walls draw close around you.',[[35,80],[45,86],[57,91],[31,94],[67,94],[48,96]]],
 ['The stone holds the cold.',[[35,80],[45,86],[57,91],[31,94],[67,94],[48,96]]],
 ['The passage curves out of sight.',[[35,80],[45,86],[57,91],[31,94],[67,94],[48,96]]],
 ['The rock twists around the passage.',[[35,80],[45,86],[57,91],[31,94],[67,94],[48,96]]]],
 'mirror-atlas':[['A great mirror fills the wall.',[[29,82],[43,88],[60,82],[74,90],[22,94],[57,95]]]],
};
const extra={
 15:['Passages lead away into the dark.',[[30,82],[44,88],[59,82],[73,89],[21,92],[56,94]]],
 175:['A fork in the silence.',[[30,82],[44,88],[59,82],[73,89],[21,92],[56,94]]],
 106:['The path follows the edge.',[[71,81],[79,88],[88,83],[62,92],[82,95],[71,95]]],
 205:['The ceiling disappears into darkness.',[[30,82],[44,88],[59,82],[73,89],[21,92],[56,94]]],
 216:['A small chamber beneath the grating.',[[30,82],[44,88],[59,82],[73,89],[21,92],[56,94]]],
};
import {regions} from './regions.js';
export const supportingProfiles=Object.fromEntries(Object.entries(regions).flatMap(([id,s])=>{
 const p=extra[id]??profiles[s.art]?.[s.cell];return p?[[id,p]]:[];
}));
Object.assign(supportingProfiles,extra);
export const supportingFloorZones=Object.fromEntries(Object.entries(supportingProfiles).map(([id,p])=>[id,p[1]]));
export const supportingHotspots={52:[{id:183,x:51,y:39}],110:[{id:234,x:51,y:39}],69:[{id:84,x:48,y:46}]};
export function supportingScene(room,scene){const p=supportingProfiles[room];return p?{...scene,caption:p[0],hotspots:supportingHotspots[room]??scene.hotspots}:scene;}
