(function(){
  var PAGE=location.pathname.split('/').pop()||'index.html';
  var lists={},cur=null;
  function keyOf(c){return c.classList.contains('specwrap')?'cmts:'+(c.dataset.ckey||'spec'):'cmts:'+PAGE}
  function apiKey(c){return keyOf(c).slice(5)}
  var useApi=true;
  function api(method,p,body){if(!useApi)return Promise.reject();return fetch('/api/comments'+(method==='GET'?'?key='+encodeURIComponent(apiKey(p)):''),{method:method,headers:{'Content-Type':'application/json'},body:method==='GET'?undefined:JSON.stringify(Object.assign({key:apiKey(p)},body))}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
  function sync(p){api('GET',p).then(function(l){lists[keyOf(p)]=l;save(p);render(p)}).catch(function(){useApi=false})}
  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
  function load(c){var k=keyOf(c);try{lists[k]=JSON.parse(localStorage.getItem(k)||'[]')}catch(e){lists[k]=[]}return lists[k]}
  function save(c){try{localStorage.setItem(keyOf(c),JSON.stringify(lists[keyOf(c)]))}catch(e){}}
  function conts(){return Array.prototype.slice.call(document.querySelectorAll('.phone,.specwrap'))}
  var st=document.createElement('style');
  st.textContent='.specwrap{position:relative}.uc-pin{touch-action:none;user-select:none;position:absolute;width:24px;height:24px;margin:-24px 0 0 -2px;border-radius:12px 12px 12px 2px;background:#f0384b;color:#fff;font:700 12px/24px Pretendard,sans-serif;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.25);z-index:60;cursor:pointer}'+
  '.uc-box{position:absolute;z-index:70;width:max-content;max-width:200px;min-width:170px;background:#fff;border:1px solid #f0384b;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.18);padding:10px;font:13px/1.45 Pretendard,sans-serif;color:#333;letter-spacing:-.02em}'+
  '.uc-box textarea{display:block;width:100%;min-height:60px;border:1px solid #e1e1e1;border-radius:8px;padding:8px;font:inherit;resize:none;outline:0}.uc-box textarea:focus{border-color:#f0384b}'+
  '.uc-box .t{white-space:pre-wrap;word-break:keep-all;overflow-wrap:break-word}'+
  '.uc-row{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}.uc-row button{height:28px;padding:0 10px;border-radius:6px;border:1px solid #e1e1e1;background:#fff;font:600 12px Pretendard,sans-serif;cursor:pointer;color:#555}.uc-row .ok{background:#f0384b;border-color:#f0384b;color:#fff}';
  document.head.appendChild(st);
  var box=null;
  function scrollers(p){if(!p.classList.contains('phone'))return [];return Array.prototype.filter.call(p.querySelectorAll('*'),function(n){if(n.closest('.uc-box'))return false;var o=getComputedStyle(n).overflowY;return (o==='auto'||o==='scroll')&&n.scrollHeight>n.clientHeight+2})}
  function contOf(p,c){if(c.a==null)return p;var l=scrollers(p),n=l[c.a];if(n&&getComputedStyle(n).position==='static')n.style.position='relative';return n||p}
    function closeBox(){if(box){box.remove();box=null}}
  function place(el,x,y,p){var W=p.scrollWidth||p.offsetWidth,H=p.scrollHeight||p.offsetHeight;el.style.left='0';el.style.top='0';p.appendChild(el);var w=el.offsetWidth,h=el.offsetHeight;el.style.left=Math.max(8,Math.min(W-w-8,x))+'px';el.style.top=Math.max(8,Math.min(H-h-8,y+6))+'px'}
  function render(p){var list=lists[keyOf(p)]||load(p);p.querySelectorAll('.uc-pin').forEach(function(n){n.remove()});
    list.forEach(function(c,i){var host=contOf(p,c);var d=document.createElement('div');d.className='uc-pin';d.textContent=i+1;d.style.left=c.x+'px';d.style.top=c.y+'px';
      d.addEventListener('click',function(e){e.stopPropagation();if(d._moved){d._moved=false;return}view(p,c,i)});
      d.addEventListener('pointerdown',function(e){
        if(e.button!==0)return;e.stopPropagation();closeBox();
        var sx=e.clientX,sy=e.clientY,ox=c.x,oy=c.y,moved=false;d._moved=false;try{d.setPointerCapture(e.pointerId)}catch(_){}d.style.cursor='grabbing';
        function mv(ev){var r=host.getBoundingClientRect(),s=r.width/host.offsetWidth;
          if(!moved&&Math.abs(ev.clientX-sx)+Math.abs(ev.clientY-sy)<4)return;moved=true;
          c.x=Math.max(0,Math.min(host.scrollWidth||host.offsetWidth,ox+(ev.clientX-sx)/s));c.y=Math.max(0,Math.min(host.scrollHeight||host.offsetHeight,oy+(ev.clientY-sy)/s));
          d.style.left=c.x+'px';d.style.top=c.y+'px'}
        function up(){d.removeEventListener('pointermove',mv);d.removeEventListener('pointerup',up);d.removeEventListener('pointercancel',up);d.style.cursor='pointer';
          if(moved){d._moved=true;save(p);api('PUT',p,{id:c.id,x:c.x,y:c.y}).catch(function(){});setTimeout(function(){d._moved=false},0)}}
        d.addEventListener('pointermove',mv);d.addEventListener('pointerup',up);d.addEventListener('pointercancel',up)});d.addEventListener('contextmenu',function(e){e.stopPropagation()});host.appendChild(d)})}
  function view(p,c,i){closeBox();box=document.createElement('div');box.className='uc-box';box.innerHTML='<div class="t"></div><div class="uc-row"><button class="del">삭제</button><button class="x">닫기</button></div>';box.querySelector('.t').textContent=c.text;
    box.querySelector('.del').onclick=function(){lists[keyOf(p)].splice(i,1);save(p);closeBox();render(p);api('DELETE',p,{id:c.id}).catch(function(){})};box.querySelector('.x').onclick=closeBox;place(box,c.x,c.y,contOf(p,c))}
  function compose(p,x,y,a){closeBox();box=document.createElement('div');box.className='uc-box';box.innerHTML='<textarea placeholder="코멘트를 입력하세요"></textarea><div class="uc-row"><button class="x">취소</button><button class="ok">등록</button></div>';
    var ta=box.querySelector('textarea');function ok(){var t=ta.value.trim();if(!t)return closeBox();var n={id:uid(),x:x,y:y,text:t};if(a!=null)n.a=a;lists[keyOf(p)]=lists[keyOf(p)]||load(p);lists[keyOf(p)].push(n);save(p);closeBox();render(p);api('POST',p,n).catch(function(){})}
    box.querySelector('.ok').onclick=ok;box.querySelector('.x').onclick=closeBox;
    ta.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ok()}if(e.key==='Escape')closeBox()});
    place(box,x,y,a!=null?contOf(p,{a:a}):p);ta.focus()}
  document.addEventListener('contextmenu',function(e){
    var hit=null;conts().forEach(function(p){var r=p.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)hit=p});
    if(!conts().length)return;e.preventDefault();if(!hit){closeBox();return}
    var host=hit,a=null;
    if(hit.classList.contains('phone')){var sc=scrollers(hit),els=document.elementsFromPoint(e.clientX,e.clientY);for(var i=0;i<els.length;i++){var k=sc.indexOf(els[i]);if(k>=0){host=els[i];a=k;break}}}
    if(a!=null&&getComputedStyle(host).position==='static')host.style.position='relative';
    var r=host.getBoundingClientRect(),s=r.width/host.offsetWidth;
    compose(hit,(e.clientX-r.left)/s+(a!=null?host.scrollLeft:0),(e.clientY-r.top)/s+(a!=null?host.scrollTop:0),a)});
  document.addEventListener('click',function(e){if(box&&!e.target.closest('.uc-box')&&!e.target.closest('.uc-pin'))closeBox()});
  function renderAll(){conts().forEach(function(p){render(p);sync(p)})}
  renderAll();window.ucRefresh=function(){closeBox();renderAll()};addEventListener('load',renderAll);setInterval(function(){if(!box&&!document.hidden)conts().forEach(sync)},15000);document.addEventListener('visibilitychange',function(){if(!document.hidden&&!box)conts().forEach(sync)});
})();
