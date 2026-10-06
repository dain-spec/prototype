(function(){
  var PAGE=location.pathname.split('/').pop()||'index.html';
  var lists={},cur=null;
  function keyOf(c){return c.classList.contains('specwrap')?'cmts:spec':'cmts:'+PAGE}
  function load(c){var k=keyOf(c);try{lists[k]=JSON.parse(localStorage.getItem(k)||'[]')}catch(e){lists[k]=[]}return lists[k]}
  function save(c){try{localStorage.setItem(keyOf(c),JSON.stringify(lists[keyOf(c)]))}catch(e){}}
  function conts(){return Array.prototype.slice.call(document.querySelectorAll('.phone,.specwrap'))}
  var st=document.createElement('style');
  st.textContent='.specwrap{position:relative}.uc-pin{position:absolute;width:24px;height:24px;margin:-24px 0 0 -2px;border-radius:12px 12px 12px 2px;background:#7a4dff;color:#fff;font:700 12px/24px Pretendard,sans-serif;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.25);z-index:60;cursor:pointer}'+
  '.uc-box{position:absolute;z-index:70;width:max-content;max-width:200px;min-width:170px;background:#fff;border:1px solid #7a4dff;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.18);padding:10px;font:13px/1.45 Pretendard,sans-serif;color:#333;letter-spacing:-.02em}'+
  '.uc-box textarea{display:block;width:100%;min-height:60px;border:1px solid #e1e1e1;border-radius:8px;padding:8px;font:inherit;resize:none;outline:0}.uc-box textarea:focus{border-color:#7a4dff}'+
  '.uc-box .t{white-space:pre-wrap;word-break:keep-all;overflow-wrap:break-word}'+
  '.uc-row{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}.uc-row button{height:28px;padding:0 10px;border-radius:6px;border:1px solid #e1e1e1;background:#fff;font:600 12px Pretendard,sans-serif;cursor:pointer;color:#555}.uc-row .ok{background:#7a4dff;border-color:#7a4dff;color:#fff}';
  document.head.appendChild(st);
  var box=null;
    function closeBox(){if(box){box.remove();box=null}}
  function place(el,x,y,p){var W=p.offsetWidth,H=p.offsetHeight;el.style.left='0';el.style.top='0';p.appendChild(el);var w=el.offsetWidth,h=el.offsetHeight;el.style.left=Math.max(8,Math.min(W-w-8,x))+'px';el.style.top=Math.max(8,Math.min(H-h-8,y+6))+'px'}
  function render(p){var list=load(p);p.querySelectorAll('.uc-pin').forEach(function(n){n.remove()});
    list.forEach(function(c,i){var d=document.createElement('div');d.className='uc-pin';d.textContent=i+1;d.style.left=c.x+'px';d.style.top=c.y+'px';
      d.addEventListener('click',function(e){e.stopPropagation();view(p,c,i)});d.addEventListener('contextmenu',function(e){e.stopPropagation()});p.appendChild(d)})}
  function view(p,c,i){closeBox();box=document.createElement('div');box.className='uc-box';box.innerHTML='<div class="t"></div><div class="uc-row"><button class="del">삭제</button><button class="x">닫기</button></div>';box.querySelector('.t').textContent=c.text;
    box.querySelector('.del').onclick=function(){lists[keyOf(p)].splice(i,1);save(p);closeBox();render(p)};box.querySelector('.x').onclick=closeBox;place(box,c.x,c.y,p)}
  function compose(p,x,y){closeBox();box=document.createElement('div');box.className='uc-box';box.innerHTML='<textarea placeholder="코멘트를 입력하세요"></textarea><div class="uc-row"><button class="x">취소</button><button class="ok">등록</button></div>';
    var ta=box.querySelector('textarea');function ok(){var t=ta.value.trim();if(!t)return closeBox();load(p);lists[keyOf(p)].push({x:x,y:y,text:t});save(p);closeBox();render(p)}
    box.querySelector('.ok').onclick=ok;box.querySelector('.x').onclick=closeBox;
    ta.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ok()}if(e.key==='Escape')closeBox()});
    place(box,x,y,p);ta.focus()}
  document.addEventListener('contextmenu',function(e){
    var hit=null;conts().forEach(function(p){var r=p.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)hit=p});
    if(!conts().length)return;e.preventDefault();if(!hit){closeBox();return}
    var r=hit.getBoundingClientRect(),s=r.width/hit.offsetWidth;
    compose(hit,(e.clientX-r.left)/s,(e.clientY-r.top)/s)});
  document.addEventListener('click',function(e){if(box&&!e.target.closest('.uc-box')&&!e.target.closest('.uc-pin'))closeBox()});
  function renderAll(){conts().forEach(render)}
  renderAll();addEventListener('load',renderAll);
})();
