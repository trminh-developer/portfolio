
export function initializeMirror(scope) {
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, setInterval, clearInterval, IntersectionObserver, MutationObserver, ResizeObserver } = scope;
/* === V12: gương phóng đại HTML thực, đi theo vị trí cuộn, có fallback nhẹ trên di động === */
(() => {
 const mirror=document.getElementById('glassMirror');
 const world=document.getElementById('glassMirrorWorld');
 const nav=document.querySelector('header nav');
 if(!mirror||!world||!nav||matchMedia('(max-width:760px)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const selectors = document.getElementById('home') ? ['#home', '#about', '#contact'] : ['#page-content'];
  const originals=selectors.map(id=>document.querySelector(id)).filter(Boolean);
 scope.defer(() => world.replaceChildren());
 const paired=[];
 function rebuild(){
  world.replaceChildren();paired.length=0;
  for(const original of originals){
   const clone=original.cloneNode(true);
   clone.classList.add('glass-copy');clone.setAttribute('aria-hidden','true');
   clone.querySelectorAll('canvas,.lanyard-hit-zone,form,button,.comment-feed').forEach(el=>el.remove());
   clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
   clone.removeAttribute('id');
   clone.querySelectorAll('.scroll-reveal,.about-reveal-ready,.reveal-ready').forEach(el=>{
    el.classList.remove('scroll-reveal','about-reveal-ready','reveal-ready');
    el.classList.add('is-visible');
    el.style.opacity='1';el.style.filter='none';el.style.transform='none';
   });
   clone.querySelectorAll('a').forEach(el=>el.removeAttribute('href'));
   world.appendChild(clone);paired.push({original,clone});
  }
  update();
 }
 const scale=1.19;
 let pending=false;
 function update(){
  pending=false;
  if(!world.isConnected||mirror.getBoundingClientRect().width===0)return;
  const n=nav.getBoundingClientRect();
  // Gương phóng đại thật: đặt clone đúng vị trí viewport và phóng 1.19x quanh tâm thanh kính.
  const ox=-scale*n.left-(scale-1)*n.width/2;
  const oy=-scale*n.top-(scale-1)*n.height/2;
  world.style.transform=`translate3d(${ox.toFixed(2)}px,${oy.toFixed(2)}px,0) scale(${scale})`;
  world.style.width=innerWidth+'px';
  for(const {original,clone} of paired){
   const r=original.getBoundingClientRect();
   clone.style.left=r.left+'px';clone.style.top=r.top+'px';
   clone.style.width=r.width+'px';clone.style.height=r.height+'px';
  }
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
 // chờ ảnh/phông chữ ổn định trước khi sao chép để tránh lớp gương lệch bố cục
 function begin(){rebuild();scope.listen(window, 'scroll',schedule,{passive:true});scope.listen(window, 'resize',schedule,{passive:true});}
 if(document.readyState==='loading') scope.listen(window, 'DOMContentLoaded',begin,{once:true});
 else begin();
 scope.listen(window, 'load',schedule,{once:true});
 if(document.fonts?.ready) document.fonts.ready.then(schedule).catch(()=>{});
})();

}
