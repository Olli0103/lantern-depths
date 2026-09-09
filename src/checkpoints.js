// Bounded, nonpersistent Undo history. Checkpoints include presentation knowledge.
export class UndoHistory {
  constructor(limit=20, maxBytes=8_000_000) { this.limit=limit;this.maxBytes=maxBytes;this.entries=[];this.bytes=0; }
  push(checkpoint) {
    const value=JSON.stringify(checkpoint),bytes=value.length*2;
    if(bytes>this.maxBytes)return;
    this.entries.push({value,bytes});this.bytes+=bytes;
    while(this.entries.length>this.limit||this.bytes>this.maxBytes){this.bytes-=this.entries.shift().bytes;}
  }
  peek(){return this.entries.length?JSON.parse(this.entries.at(-1).value):null;}
  pop(){const item=this.entries.pop();if(item)this.bytes-=item.bytes;}
  clear(){this.entries=[];this.bytes=0;}
  get length(){return this.entries.length;}
}
export class CommandHistory {
  values=[];index=0;draft='';
  add(command){if(this.values.at(-1)!==command)this.values.push(command);this.values=this.values.slice(-100);this.reset();}
  reset(){this.index=this.values.length;this.draft='';}
  previous(current){if(this.index===this.values.length)this.draft=current;if(this.index>0)this.index--;return this.values[this.index]??current;}
  next(current){if(this.index===this.values.length)return current??this.draft;this.index++;return this.values[this.index]??this.draft;}
}
// Keep the interpreter's unseeded Math.random distribution, but retain a bounded
// tape of its draws so Undo can replay them. Never reseed or alter puzzle code.
export class EntropyTape {
  base=0;cursor=0;values=[];
  draw(){
    let i=this.cursor-this.base;
    if(i===this.values.length)this.values.push(Math.random());
    const value=this.values[i];this.cursor++;
    if(this.values.length>8192){const n=this.values.length-8192;this.values.splice(0,n);this.base+=n;}
    return value;
  }
  snapshot(){return {base:this.base,cursor:this.cursor,values:[...this.values]};}
  restore(data,future){
    if(!data)return;
    const valid=d=>d&&Number.isSafeInteger(d.base)&&d.base>=0&&Number.isSafeInteger(d.cursor)&&Array.isArray(d.values)&&d.values.length<=8192&&d.cursor>=d.base&&d.cursor<=d.base+d.values.length&&d.values.every(v=>typeof v==='number'&&v>=0&&v<1);
    if(!valid(data))throw Error('Invalid random continuation.');
    let values=[...data.values];
    if(valid(future)&&future.base<=data.cursor&&future.base+future.values.length>data.base+values.length){
      const overlapStart=Math.max(data.base,future.base),overlapEnd=Math.min(data.base+values.length,future.base+future.values.length);
      let compatible=true;for(let i=overlapStart;i<overlapEnd;i++)if(values[i-data.base]!==future.values[i-future.base])compatible=false;
      if(compatible)values.push(...future.values.slice(data.base+values.length-future.base));
    }
    // A checkpoint always retains its cursor even if a future tape is larger.
    this.base=data.base;this.cursor=data.cursor;this.values=values.slice(0,8192);
  }
}
