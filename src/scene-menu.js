// Reuse the one existing selection/action DOM tree. Native popover supplies a
// nonmodal top layer: no duplicate controls, no backdrop covering the painting.
export class SceneMenu {
  constructor(scene,selection,home,panel,parser){
    Object.assign(this,{scene,selection,home,panel,parser});this.anchorId=null;
    document.addEventListener('pointerdown',e=>{if(this.anchorId!==null&&!panel.contains(e.target))this.close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.anchorId!==null){this.close(true);}});
    window.addEventListener('resize',()=>this.position());
    window.addEventListener('scroll',()=>this.position(),{passive:true,capture:true});
  }
  anchor(){return this.scene.querySelector(`[data-object-id="${this.anchorId}"], [data-select-id="${this.anchorId}"]`);}
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
    const limit=small?Math.min(innerHeight-12,this.parser.getBoundingClientRect().top-10):innerHeight-12;
    this.panel.style.maxHeight=Math.max(100,limit-12)+'px';
    this.panel.style.width=(small?Math.min(330,innerWidth-24):280)+'px';
    const {width,height}=this.panel.getBoundingClientRect();
    let x=r.right+12;if(x+width>innerWidth-12)x=r.left-width-12;
    if(small)x=(innerWidth-width)/2;
    this.panel.style.left=Math.max(12,Math.min(x,innerWidth-width-12))+'px';
    this.panel.style.top=Math.max(12,Math.min(r.top,limit-height))+'px';
  }
  close(focus=false){
    if(this.anchorId===null)return;
    const anchor=this.anchor();this.anchorId=null;
    if(this.panel.matches(':popover-open'))this.panel.hidePopover();
    this.home.append(this.selection);
    if(focus)(anchor??this.parser.querySelector('input')).focus({preventScroll:true});
  }
}
