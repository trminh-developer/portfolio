
export function initializeLoading(scope) {
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, setInterval, clearInterval, IntersectionObserver, MutationObserver, ResizeObserver } = scope;
/* Card skeleton: biến mất khi canvas Three.js đã render hoặc chế độ dự phòng được kích hoạt. */
    (() => {
        const hero=document.getElementById('cardContainer');
        if(!hero)return;
        let finished=false;
        const done=()=>{
          if(finished)return;
          finished=true;
          hero.classList.remove('is-card-loading');
          hero.classList.add('card-skeleton-done');
          observer.disconnect();
        };
        const observer=new MutationObserver(()=>{if(hero.classList.contains('three-ready')) done();});
        observer.observe(hero,{attributes:true,attributeFilter:['class']});
        scope.listen(window, 'chien:card-fallback',done,{once:true});
        // Bảo vệ nếu script WebGL lỗi trước khi báo trạng thái.
        setTimeout(()=>{if(!hero.classList.contains('three-ready')) done();},7000);
    })();
    /* Chân dung: khung chỉ chờ decode ảnh thật, không giữ chờ giả. */
    (() => {
      const stage=document.getElementById('about-person-stage');
      if(!stage)return;
      const portraits=[...stage.querySelectorAll('.about-person-base, .about-person-suit')];
      if(!portraits.length)return;
      stage.classList.add('is-skeleton-loading');
      const settle=(img)=>{
         if(img.complete) return (img.decode ? img.decode().catch(()=>{}) : Promise.resolve());
         return new Promise(resolve=>{
            scope.listen(img, 'load',resolve,{once:true});
            scope.listen(img, 'error',resolve,{once:true});
         }).then(()=> img.decode ? img.decode().catch(()=>{}) : Promise.resolve());
      };
      Promise.all(portraits.map(settle)).then(()=>stage.classList.remove('is-skeleton-loading'));
    })();

}
