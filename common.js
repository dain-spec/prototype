const PERIODS=['전체','1주일','1개월','3개월','6개월','1년','직접입력'];
const fmt=d=>d.toISOString().slice(0,10);
function periodLabel(p){return p.key==='직접입력'?`${p.from||'시작일'} ~ ${p.to||'종료일'}`:p.key}
function toast(msg){const t=document.querySelector('.toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1800)}
const store={get recent(){try{return JSON.parse(localStorage.getItem('recent')||'["출장비 정산","3분기 회의록","김민수","휴가 신청서"]')}catch(e){return[]}},set recent(v){try{localStorage.setItem('recent',JSON.stringify(v))}catch(e){}}};
const ICON={search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'};
function renderRecent(el,onPick,onChange){const list=store.recent;el.innerHTML=list.length?list.map((k,i)=>`<li data-k="${k}">${ICON.clock}<span>${k}</span><button class="del" data-i="${i}">×</button></li>`).join(''):'<div class="empty">최근 검색어가 없습니다</div>';el.querySelectorAll('li').forEach(li=>li.onclick=e=>{if(e.target.classList.contains('del')){const l=store.recent;l.splice(+e.target.dataset.i,1);store.recent=l;renderRecent(el,onPick,onChange);onChange&&onChange();return}onPick(li.dataset.k)})}
function saveRecent(k){store.recent=[k,...store.recent.filter(x=>x!==k)].slice(0,10)}
const HOT=['연차 사용','전자결재 양식','법인카드','회의실 예약','급여명세서','출장 신청','공지사항','조직도'];
const hotHTML=()=>`<div class="rank-grid">${HOT.map((k,i)=>`<ul class="rank" style="display:contents"><li data-k="${k}"><b>${i+1}</b>${k}</li></ul>`).join('')}</div>`;
