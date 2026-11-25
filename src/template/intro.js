
export function initializeIntro(scope) {
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, setInterval, clearInterval, IntersectionObserver, MutationObserver, ResizeObserver } = scope;
(() => {
        'use strict';
        const loader=document.getElementById('loader'), percent=document.getElementById('pctText');
        const bar=document.getElementById('progressBar'), skip=document.getElementById('introSkip');
        const status=document.getElementById('introStatus'), timer=document.getElementById('cinemaTime');
        if(!loader||!percent||!bar||!skip)return;
        const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
        const duration=reduced?2300:4300, hold=reduced?120:320, start=performance.now();
        let ready=document.readyState==='complete', done=false, frame=0, last=-1;
        function draw(p){
          const n=Math.max(0,Math.min(100,Math.floor(p)));
          if(n!==last){last=n;percent.innerHTML=n+'<span>%</span>';bar.style.width=n+'%';}
          loader.classList.toggle('hands-touching', n>=86);
          if(n>=86) status.textContent='ĐÃ SẴN SÀNG';
          else if(n>=60) status.textContent='ĐANG HOÀN THIỆN';
          else if(n>=26) status.textContent='ĐANG KẾT NỐI';
          else status.textContent='ĐANG MỞ KHÔNG GIAN';
        }
        function finish(){
          if(done)return;done=true;cancelAnimationFrame(frame);draw(100);
          status.textContent='HOÀN TẤT';
          setTimeout(()=>{loader.classList.add('is-exiting');
            setTimeout(()=>loader.remove(),reduced?180:790);},hold);
        }
        function step(now){
          if(done)return;
          const elapsed=now-start;
          const t=Math.min(elapsed/duration,1);
          const s=elapsed/1000;
          if(timer)timer.textContent='[ 00 . '+String(Math.floor(s)).padStart(2,'0')+' . '+String(Math.floor((s%1)*100)).padStart(2,'0')+' ]';
          const eased = t<0.6
            ? 100*(0.55*(1-Math.pow(1-(t/0.6),1.8)))
            : 55 + 45*(1-Math.pow(1-((t-0.6)/0.4),1.35));
          draw(Math.min(eased, 99.6));
          if((elapsed>=duration&&ready)||elapsed>=9200){finish();return}
          frame=requestAnimationFrame(step);
        }
        if(!ready)scope.listen(window, 'load',()=>ready=true,{once:true});
        scope.listen(skip, 'click',finish);
        frame=requestAnimationFrame(step);
      })();

}
