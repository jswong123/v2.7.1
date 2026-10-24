/* V2.7.5: presentation-only unit inspector controls. */
(() => {
 const panel=document.getElementById('unitFloat'), handle=document.getElementById('unitWindowHandle');
 const reopen=document.getElementById('unitWindowReopen');
 if(!panel||!handle||!reopen)return;
 const key='frontline.unitWindow.v275';
 let state={};try{state=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(state))}catch{}};
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const bounds=()=>({w:window.innerWidth,h:window.innerHeight});
 const fit=()=>{const {w,h}=bounds();const pw=panel.offsetWidth,ph=panel.offsetHeight;
  panel.style.setProperty('transform','none','important');
  panel.style.setProperty('left',clamp(panel.getBoundingClientRect().left,0,Math.max(0,w-pw))+'px','important');
  panel.style.setProperty('top',clamp(panel.getBoundingClientRect().top,48,Math.max(48,h-Math.min(ph,38)))+'px','important');
  panel.style.setProperty('right','auto','important');panel.style.setProperty('bottom','auto','important');};
 const apply=()=>{
  panel.style.setProperty('transform','none','important');
  if(state.width)panel.style.setProperty('width',Math.min(state.width,innerWidth-16)+'px','important');
  if(state.height)panel.style.setProperty('height',Math.min(state.height,innerHeight-16)+'px','important');
  if(Number.isFinite(state.left)){panel.style.setProperty('left',state.left+'px','important');panel.style.setProperty('right','auto','important')}
  if(Number.isFinite(state.top)){panel.style.setProperty('top',state.top+'px','important');panel.style.setProperty('bottom','auto','important')}
  panel.classList.toggle('unit-window-minimized',!!state.minimized);
  panel.classList.toggle('unit-window-maximized',!!state.maximized);
  panel.classList.toggle('unit-window-closed',!!state.closed);
  reopen.hidden=!state.closed;fit();
 };
 document.getElementById('unitWindowClose').addEventListener('click',()=>{state.closed=true;save();apply()});
 reopen.addEventListener('click',()=>{state.closed=false;save();apply()});
 document.getElementById('unitWindowMin').addEventListener('click',()=>{state.minimized=!state.minimized;state.maximized=false;save();apply()});
 document.getElementById('unitWindowMax').addEventListener('click',()=>{state.maximized=!state.maximized;state.minimized=false;save();apply()});
 let drag=null;
 handle.addEventListener('pointerdown',e=>{if(e.target.closest('button')||state.maximized)return;const rect=panel.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:rect.left,top:rect.top};handle.setPointerCapture(e.pointerId)});
 handle.addEventListener('pointermove',e=>{if(!drag)return;const {w,h}=bounds();const left=clamp(drag.left+e.clientX-drag.x,0,Math.max(0,w-panel.offsetWidth));const top=clamp(drag.top+e.clientY-drag.y,0,Math.max(0,h-panel.offsetHeight));panel.style.setProperty('left',left+'px','important');panel.style.setProperty('top',top+'px','important');panel.style.setProperty('right','auto','important');panel.style.setProperty('bottom','auto','important')});
 const end=()=>{if(!drag)return;drag=null;state.left=panel.getBoundingClientRect().left;state.top=panel.getBoundingClientRect().top;save()};handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(()=>{if(state.maximized||state.minimized||state.closed)return;if(panel.offsetWidth&&panel.offsetHeight){state.width=panel.offsetWidth;state.height=panel.offsetHeight;save()}});observer.observe(panel)}
 window.addEventListener('resize',fit);handle.addEventListener('dblclick',e=>{if(e.target.closest('button'))return;state.left=Math.max(8,(innerWidth-850)/2);state.top=55;state.minimized=false;state.maximized=false;save();apply()});apply();
})();