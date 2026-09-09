import adapters from './story-adapters.json' with {type:'json'};
import { EntropyTape } from './checkpoints.js';
// Presentation adapter for ifvms; all puzzle logic remains in the original story.
export class Engine {
  constructor(ZVM, bytes) {
    const header=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    const serial=String.fromCharCode(...bytes.subarray(18,24));
    this.adapter=Object.values(adapters).find(a=>a.length===bytes.length&&a.release===header.getUint16(2)&&a.serial===serial&&a.checksum===header.getUint16(28));
    if(!this.adapter)throw Error('Unsupported story build.');
    this.reverse=this.adapter.objects?Object.fromEntries(Object.entries(this.adapter.objects).map(([a,b])=>[b,Number(a)])):null;
    this.output = '';
    this.vm = new ZVM();
    const vm = this.vm;
    this.entropy = new EntropyTape();
    const originalRandom=vm.random, entropy=this.entropy;
    vm.random=function(range){
      if(range<1||this.xorshift_seed!==0)return originalRandom.call(this,range);
      return 1 + (entropy.draw()*range) | 0;
    };
    class RefStruct {
      fields = [];
      push_field(v) { this.fields.push(v); }
      get_field(i) { return this.fields[i]; }
    }
    class RefBox {
      value = 0;
      set_value(v) { this.value = v; }
      get_value() { return this.value; }
    }
    const noop = () => {};
    const glk = {
      RefStruct, RefBox,
      glk_gestalt: () => 0,
      glk_stylehint_set: noop, glk_stylehint_clear: noop,
      glk_set_style: noop, glk_set_window: noop,
      glk_window_open: (_split, _method, _size, type, rock) => ({ type, rock }),
      glk_window_close: noop, glk_window_clear: noop,
      glk_window_get_size: (_win, w, h) => { if (w) w.set_value(100); if (h) h.set_value(30); },
      glk_window_get_stream: win => win,
      glk_window_move_cursor: noop,
      glk_window_get_parent: win => win,
      glk_window_set_arrangement: noop,
      glk_put_jstring: text => { this.output += text; },
      glk_put_jstring_stream: (win, text) => { if (win?.rock === 201) this.output += text; },
      glk_request_line_event_uni: noop,
      glk_select: noop, update: noop,
      glk_exit: () => { vm.quit = true; vm.stop = 1; },
      fatal_error: e => { throw e; },
    };
    vm.prepare(new Uint8Array(bytes), { Glk: glk });
    vm.init();
  }
  command(text) {
    const vm = this.vm;
    if (vm.quit) throw new Error('This session has ended. Start a new game.');
    if (!vm.read_data?.buffer) throw new Error('The story is not waiting for a command.');
    if (/^(save|restore|script|unscript|restart)\b/i.test(text.trim())) {
      return 'Use the Save, Load and New game controls above.';
    }
    this.output = '';
    const buffer = vm.read_data.buffer;
    const chars = Array.from(text.slice(0, buffer.length), c => c.charCodeAt(0));
    buffer.fill(0);
    chars.forEach((c, i) => { buffer[i] = c; });
    vm.glk_event.fields = [3, vm.mainwin, chars.length, 0];
    vm.resume();
    return this.output.trim();
  }
  completed(){const f=this.adapter.finish;return this.state().room===244&&!!f&&(this.vm.stack.getUint32(this.vm.frameptr)>>>8)===f.caller&&(this.vm.pc===f.read||(this.vm.quit&&this.vm.pc===f.quit));}
  raw(id){if(!id)return 0;const value=this.adapter.objects?.[id]??id;if(!Number.isInteger(value)||value<1||value>250)throw Error('Unknown object');return value;}
  canonical(id){return this.reverse?.[id]??id;}
  mapped(kind,id){const map=this.adapter[kind];if(!map)return id;if(!Object.hasOwn(map,id))throw Error(`Unmapped ${kind} symbol: ${id}`);return map[id];}
  prop(id,property){return this.vm.get_prop(this.raw(id),this.mapped('properties',property));}
  global(index){return this.vm.m.getInt16(this.vm.globals+this.mapped('globals',index)*2);}
  children(id){const result=[];for(let child=this.vm.get_child(this.raw(id));child;child=this.vm.get_sibling(child))result.push(this.canonical(child));return result;}
  name(id) {
    if (!id) return '';
    const vm = this.vm;
    const prop = vm.m.getUint16(vm.objects + 9 * this.raw(id) + 7);
    return String(vm.decode(prop + 1, vm.m.getUint8(prop) * 2));
  }
  state() {
    const vm = this.vm;
    const room = this.canonical(vm.m.getUint16(vm.globals));
    return { room, name: this.name(room), score: vm.m.getInt16(vm.globals + 2), turns: vm.m.getUint16(vm.globals + 4) };
  }
  flag(id, bit) { return !!this.vm.test_attr(this.raw(id), this.mapped('flags',bit)); }
  parent(id) { return this.canonical(this.vm.get_parent(this.raw(id))); }
  inventory() {
    const items = [];
    for (const id of this.children(44)) items.push({ id, name: this.name(id) });
    return items;
  }
  visible(id) {
    if (this.flag(id, 7)) return false;
    let parent = this.parent(id);
    const room = this.state().room;
    const seen = new Set();
    while (parent && !seen.has(parent)) {
      if (parent === room || parent === 44) return true;
      seen.add(parent);
      if (this.flag(parent,7)) return false;
      if (!this.flag(parent, 11) && !this.flag(parent, 12)) return false;
      parent = this.parent(parent);
    }
    return false;
  }
  carried(id) {
    const seen=new Set();let parent=this.parent(id);
    while(parent&&!seen.has(parent)){if(parent===44)return true;seen.add(parent);parent=this.parent(parent);}
    return false;
  }
  lit() {
    if (this.flag(this.state().room, 19)) return true;
    for (let id = 1; id <= 250; id++) if (this.flag(id, 19) && this.visible(id)) return true;
    return false;
  }
  snapshot() {
    const vm = this.vm;
    return { version: 1, signature: vm.signature, data: Array.from(new Uint8Array(vm.save_file(vm.pc))), read: structuredClone(vm.read_data), random: vm.xorshift_seed, quit: !!vm.quit, entropy: this.entropy.snapshot() };
  }
  restore(save, futureEntropy) {
    const vm = this.vm;
    if (save.version !== 1 || save.signature !== vm.signature || !Array.isArray(save.data) || !save.read?.buffer) throw new Error('This save does not match this story.');
    this.entropy.restore(save.entropy, futureEntropy);
    if (!vm.restore_file(new Uint8Array(save.data))) throw new Error('Could not restore this save.');
    vm.read_data = structuredClone(save.read);
    vm.xorshift_seed = save.random;
    vm.quit = save.quit;
    vm.glk_event.fields = [];
  }
}
