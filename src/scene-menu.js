// Reuse the one existing selection/action DOM tree. Native popover supplies a
// nonmodal top layer: no duplicate controls, no backdrop covering the painting.
export class SceneMenu {
  constructor(scene,selection,home,panel,parser){
    Object.assign(this,{scene,selection,home,panel,parser});this.anchorId=null;
    document.addEventListener('pointerdown',e=>{if(this.anchorId!==null&&!panel.contains(e.target))this.close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.anchorId!==null){this.close(true);}});
    window.addEventListener('resize',()=>this.position());
    window.visualViewport?.addEventListener('resize',()=>this.position());
    window.visualViewport?.addEventListener('scroll',()=>this.position());
    window.addEventListener('scroll',()=>this.position(),{passive:true,capture:true});
  }
  anchor(){return this.scene.querySelector(`[data-object-id="${this.anchorId}"], [data-select-id="${this.anchorId}"]`)??document.querySelector(`[data-select-id="${this.anchorId}"]`);}
  open(id){
    // Accessible sidebar is a complete fallback on browsers without Popover.
    if(!this.panel.showPopover)return false;
    this.anchorId=id;this.panel.append(this.selection);
    if(!this.panel.matches(':popover-open'))this.panel.showPopover();
    this.position();return true;
  }
  sync(){if(this.anchorId===null)return;if(this.selection.hidden||!this.anchor()||this.scene.dataset.dark==='true'){this.close();return;}this.position();}
  position(){
    if(this.anchorId===null)return;
    const anchor=this.anchor();if(!anchor)return;
    const r=anchor.getBoundingClientRect(),small=innerWidth<=760;
    const limit=Math.min(innerHeight-12,this.parser.getBoundingClientRect().top-10);
    this.panel.style.maxHeight=Math.max(100,small?Math.min(innerHeight*.42,limit-12):limit-12)+'px';
    this.panel.style.width=(small?Math.min(480,innerWidth-24):300)+'px';
    const {width,height}=this.panel.getBoundingClientRect();
    // Desktop: sit below and beside the marker rather than over the object it
    // marks, so a state change (an opened mailbox) stays visible while its
    // actions are shown. Fall back to the other side, then above, when clipped.
    let x=r.right+28;if(x+width>innerWidth-12)x=r.left-width-28;
    if(small)x=(innerWidth-width)/2;
    let y=r.bottom+14;if(y+height>limit)y=r.top-height-14;if(y<12)y=Math.min(r.top,limit-height);
    this.panel.style.left=Math.max(12,Math.min(x,innerWidth-width-12))+'px';
    this.panel.style.top=Math.max(12,(small?limit-height:y))+'px';
  }
  close(focus=false){
    if(this.anchorId===null)return;
    const anchor=this.anchor();this.anchorId=null;
    if(this.panel.matches(':popover-open'))this.panel.hidePopover();
    this.home.append(this.selection);
    if(focus)(anchor??this.parser.querySelector('input')).focus({preventScroll:true});
  }
}
