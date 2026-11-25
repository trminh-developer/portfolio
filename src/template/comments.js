
export async function initializeComments(scope) {
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, setInterval, clearInterval, IntersectionObserver, MutationObserver, ResizeObserver } = scope;
/* === V14: Google login + Firestore + ảnh đại diện tùy chọn (nén JPEG) === */
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const getEl=id=>document.getElementById(id);
const status=getEl('commentsNotice'), feed=getEl('commentFeed'), count=getEl('commentsTotal');
const loginBtn=getEl('commentLoginBtn'), userInfo=getEl('commentCurrentUser');
const form=getEl('commentForm'), textarea=getEl('commentText'), submitBtn=getEl('commentSubmitBtn');
const displayNameInput=getEl('commentDisplayName');
const avatarInput=getEl('commentAvatarInput'),avatarPreview=getEl('commentAvatarPreview');
const avatarLabel=getEl('commentAvatarLabel'),avatarClear=getEl('commentAvatarClear');
let uploadedAvatarData='';
// Ảnh thu nhỏ được lưu trực tiếp vào bình luận Firestore, KHÔNG cần Firebase Storage.
function resetAvatar(){
 uploadedAvatarData='';avatarInput.value='';avatarPreview.hidden=true;avatarPreview.removeAttribute('src');
 avatarLabel.textContent='Chọn ảnh đại diện';avatarClear.hidden=true;
}
scope.listen(avatarClear, 'click',()=>{resetAvatar();setStatus('Đã bỏ ảnh tùy chọn. Khi đăng, ảnh Google (nếu có) sẽ được sử dụng.');});
scope.listen(avatarInput, 'change',async()=>{
 const file=avatarInput.files&&avatarInput.files[0];
 if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024||file.size===0){
  resetAvatar();setStatus('Chỉ nhận ảnh JPG, PNG hoặc WebP, dung lượng tối đa 5 MB.');return;
 }
 let tempURL='';
 try{
  tempURL=URL.createObjectURL(file);
  const img=await new Promise((resolve,reject)=>{
   const picture=new Image();picture.onload=()=>resolve(picture);
   picture.onerror=()=>reject(new Error('Không đọc được ảnh.'));
   picture.src=tempURL;
  });
  let compressed='';
  for(const side of [192,160,128,96]){
   const scale=Math.min(1,side/Math.max(img.naturalWidth,img.naturalHeight));
   const c=document.createElement('canvas');
   c.width=Math.max(1,Math.round(img.naturalWidth*scale));
   c.height=Math.max(1,Math.round(img.naturalHeight*scale));
   const ctx=c.getContext('2d');if(!ctx)throw new Error('Không thể xử lý ảnh.');
   ctx.fillStyle='#182234';ctx.fillRect(0,0,c.width,c.height);
   ctx.drawImage(img,0,0,c.width,c.height);
   for(const quality of [0.82,0.66,0.5]){
    const data=c.toDataURL('image/jpeg',quality);
    if(data.length<=72000){compressed=data;break;}
   }
   if(compressed)break;
  }
  if(!compressed)throw new Error('Ảnh chưa thể nén đủ nhỏ. Hãy chọn ảnh khác.');
  uploadedAvatarData=compressed;avatarPreview.src=compressed;avatarPreview.hidden=false;
  avatarLabel.textContent=file.name.length>38?file.name.slice(0,35)+'…':file.name;
  avatarClear.hidden=false;
  setStatus('Đã chọn ảnh đại diện. Ảnh sẽ hiển thị cùng bình luận sau khi bạn đăng nhập và gửi.');
 }catch(e){resetAvatar();setStatus(e.message||'Không đọc được ảnh đại diện.');}
 finally{if(tempURL)URL.revokeObjectURL(tempURL);}
});
scope.listen(textarea, 'input',()=>{getEl('commentChars').textContent=String(textarea.value.length);});
function setStatus(message){status.textContent=message;}
const configured=!!(FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.includes('DAN_')
 && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.projectId!=='TEN-DU-AN'
 && FIREBASE_CONFIG.appId && !FIREBASE_CONFIG.appId.includes('DAN_')
 && FIREBASE_CONFIG.authDomain && !FIREBASE_CONFIG.authDomain.startsWith('TEN-'));
if(configured){
 // Skeleton chỉ xuất hiện khi thật sự đang nạp Firestore.
 feed.setAttribute('aria-busy','true');
 feed.setAttribute('aria-label','Đang tải bình luận công khai');
 feed.innerHTML=Array.from({length:3},(_,i)=>`<div class="comment-skeleton-item" aria-hidden="true"><span class="comment-skeleton-avatar sk-shimmer"></span><div class="comment-skeleton-copy"><span class="comment-skeleton-line short sk-shimmer"></span><span class="comment-skeleton-line long sk-shimmer"></span><span class="comment-skeleton-line ${i===2?'medium':'long'} sk-shimmer"></span></div></div>`).join('');
 try {
  const VERSION='13.4.0';
  const [fb,fa,fs]=await Promise.all([
   import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${VERSION}/firebase-app.js`),
   import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${VERSION}/firebase-auth.js`),
   import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${VERSION}/firebase-firestore.js`)
  ]);
  if (!scope.active) return;
  const app=fb.getApps()[0] || fb.initializeApp(FIREBASE_CONFIG),auth=fa.getAuth(app),db=fs.getFirestore(app);
  const provider=new fa.GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account'});
  let activeUser=null,sending=false;
  function updateAuth(user){
   activeUser=user;
   const signedIn=!!user;
   loginBtn.disabled=false;
   loginBtn.textContent=signedIn?'Đăng xuất':'Đăng nhập Google';
   textarea.disabled=!signedIn;
   textarea.placeholder=signedIn?'Hãy viết ý kiến của bạn ở đây...':'Đăng nhập Google để bình luận...';
   if(signedIn && !displayNameInput.value.trim())displayNameInput.value=(user.displayName||'Thành viên').slice(0,80);
   submitBtn.disabled=!signedIn||sending;
   userInfo.replaceChildren();
   if(signedIn){
    const safeName=(user.displayName||'Thành viên').slice(0,80);
    if(user.photoURL && /^https:\/\//i.test(user.photoURL)){
     const img=document.createElement('img');img.src=user.photoURL;img.referrerPolicy='no-referrer';img.alt='';userInfo.appendChild(img);
    }
    const name=document.createElement('span');name.textContent=safeName;userInfo.appendChild(name);
    setStatus('Bạn đang đăng nhập. Bình luận sẽ hiển thị công khai sau khi gửi.');
   } else {
    userInfo.textContent='Chưa đăng nhập';
    setStatus('Đăng nhập bằng Google để đăng bình luận. Bạn có thể đọc mà không cần đăng nhập.');
   }
  }
  scope.defer(fa.onAuthStateChanged(auth, updateAuth, error => setStatus('Không kiểm tra được đăng nhập: '+error.code)));
  scope.listen(loginBtn, 'click',async()=>{
   loginBtn.disabled=true;
   try{
    if(auth.currentUser) await fa.signOut(auth);
    else {
     if(location.protocol==='file:') {setStatus('Đăng nhập Google chỉ hoạt động trên địa chỉ HTTPS đã khai báo trong Firebase. Hãy mở website đã đăng Netlify.');return;}
     await fa.signInWithPopup(auth,provider);
    }
   }catch(e){
    if(e.code==='auth/popup-closed-by-user')setStatus('Bạn đã đóng cửa sổ đăng nhập.');
    else if(e.code==='auth/unauthorized-domain')setStatus('Tên miền website chưa nằm trong danh sách Authorized domains của Firebase.');
    else setStatus('Đăng nhập không thành công: '+(e.code||e.message));
   }finally{loginBtn.disabled=false;}
  });
  function createComment(data){
   const article=document.createElement('article');article.className='comment-entry';
   const avatar=document.createElement('div');avatar.className='comment-avatar';
   const title=(typeof data.name==='string'&&data.name.trim()?data.name:'Thành viên').slice(0,80);
   const url=typeof data.photoURL==='string'?data.photoURL:'';
   if(/^https:\/\//i.test(url)||(/^data:image\/(jpeg|webp);base64,[A-Za-z0-9+/=]+$/i.test(url)&&url.length<=90000)){
    const img=document.createElement('img');img.src=url;img.referrerPolicy='no-referrer';img.alt='';img.loading='lazy';
    scope.listen(img, 'error',()=>{avatar.textContent=title[0].toUpperCase();},{once:true});avatar.appendChild(img);
   }else avatar.textContent=title[0].toUpperCase();
   const body=document.createElement('div');body.className='comment-content';
   const meta=document.createElement('div');meta.className='comment-meta';
   const name=document.createElement('span');name.className='comment-name';name.textContent=title;
   const date=document.createElement('time');date.className='comment-date';
   const dateValue=data.createdAt?.toDate?.();
   date.textContent=dateValue?dateValue.toLocaleDateString('vi-VN'):'Vừa đăng';
   if(dateValue)date.dateTime=dateValue.toISOString();
   meta.append(name,date);
   const paragraph=document.createElement('p');paragraph.className='comment-text';paragraph.textContent=String(data.text||'').slice(0,850);
   body.append(meta,paragraph);article.append(avatar,body);return article;
  }
  const q=fs.query(fs.collection(db,'portfolioComments'),fs.orderBy('createdAt','desc'),fs.limit(60));
  scope.defer(fs.onSnapshot(q,snapshot=>{
   feed.removeAttribute('aria-busy');
   feed.setAttribute('aria-label','Danh sách bình luận công khai');
   count.textContent=snapshot.size+' bình luận mới nhất';
   const fragment=document.createDocumentFragment();
   if(snapshot.empty){const p=document.createElement('p');p.className='comment-empty';p.textContent='Chưa có bình luận nào. Bạn có thể là người đầu tiên!';fragment.appendChild(p);}
   snapshot.forEach(d=>fragment.appendChild(createComment(d.data())));
   feed.replaceChildren(fragment);
  },error=>{
   feed.removeAttribute('aria-busy');
   feed.setAttribute('aria-label','Danh sách bình luận công khai');
   count.textContent='Chưa tải được';
   feed.replaceChildren();
   const p=document.createElement('p');p.className='comment-empty';p.textContent='Không tải được bình luận: '+(error.code||'Có lỗi kết nối');feed.appendChild(p);
  }));
  scope.listen(form, 'submit',async e=>{
   e.preventDefault();
   if(!activeUser){setStatus('Vui lòng đăng nhập Google trước khi bình luận.');return;}
   const content=textarea.value.trim();
   if(content.length<2||content.length>850){setStatus('Bình luận cần từ 2 đến 850 ký tự.');return;}
   if(displayNameInput.value.trim().length>80){setStatus('Tên hiển thị tối đa 80 ký tự.');return;}
   if(sending)return;
   sending=true;submitBtn.disabled=true;submitBtn.textContent='Đang gửi...';
   try{
    await fs.addDoc(fs.collection(db,'portfolioComments'),{
     uid:activeUser.uid,
     name:(displayNameInput.value.trim()||activeUser.displayName||'Thành viên').slice(0,80),
     photoURL:uploadedAvatarData || (activeUser.photoURL||'').slice(0,2048),
     text:content,
     createdAt:fs.serverTimestamp()
    });
    textarea.value='';getEl('commentChars').textContent='0';resetAvatar();
    setStatus('Đã gửi bình luận thành công.');
   }catch(e){setStatus('Chưa gửi được: '+(e.code||e.message)+'. Kiểm tra quyền Firestore.');}
   finally{sending=false;submitBtn.textContent='Gửi bình luận ↗';submitBtn.disabled=!activeUser;}
  });
 }catch(error){
  if (!scope.active) return;
  feed.removeAttribute('aria-busy');
  feed.setAttribute('aria-label','Danh sách bình luận công khai');
  feed.innerHTML='<p class="comment-empty">Không thể kết nối cơ sở dữ liệu bình luận. Vui lòng thử lại sau.</p>';
  setStatus('Không khởi tạo được Firebase: '+(error.message||String(error)));
  count.textContent='Chưa kết nối';
 }
}

}
