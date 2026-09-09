// Presentation adapter for ifvms; all puzzle logic remains in the original story.
export class Engine {
  constructor(ZVM, bytes) {
    this.output = '';
    this.vm = new ZVM();
    const vm = this.vm;
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
  name(id) {
    if (!id) return '';
    const vm = this.vm;
    const prop = vm.m.getUint16(vm.objects + 9 * id + 7);
    return String(vm.decode(prop + 1, vm.m.getUint8(prop) * 2));
  }
  state() {
    const vm = this.vm;
    const room = vm.m.getUint16(vm.globals);
    return { room, name: this.name(room), score: vm.m.getInt16(vm.globals + 2), turns: vm.m.getUint16(vm.globals + 4) };
  }
  flag(id, bit) { return !!this.vm.test_attr(id, bit); }
  parent(id) { return this.vm.get_parent(id); }
  inventory() {
    const items = [];
    for (let id = this.vm.get_child(44); id; id = this.vm.get_sibling(id)) items.push({ id, name: this.name(id) });
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
  lit() {
    if (this.flag(this.state().room, 19)) return true;
    for (let id = 1; id <= 250; id++) if (this.flag(id, 19) && this.visible(id)) return true;
    return false;
  }
  snapshot() {
    const vm = this.vm;
    return { version: 1, signature: vm.signature, data: Array.from(new Uint8Array(vm.save_file(vm.pc))), read: structuredClone(vm.read_data), random: vm.xorshift_seed, quit: !!vm.quit };
  }
  restore(save) {
    const vm = this.vm;
    if (save.version !== 1 || save.signature !== vm.signature || !Array.isArray(save.data) || !save.read?.buffer) throw new Error('This save does not match this story.');
    if (!vm.restore_file(new Uint8Array(save.data))) throw new Error('Could not restore this save.');
    vm.read_data = structuredClone(save.read);
    vm.xorshift_seed = save.random;
    vm.quit = save.quit;
    vm.glk_event.fields = [];
  }
}
