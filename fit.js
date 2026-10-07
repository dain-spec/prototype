(function(){
  var st=document.createElement('style');
  st.textContent='html,body{height:100%;overflow:hidden}body{display:block!important;position:relative;min-height:0!important}#fit{position:absolute;left:50%;top:24px;display:flex;align-items:flex-start;gap:28px;transform-origin:top center}';
  document.head.appendChild(st);
  if(/nospec/.test(location.search)){var sp=document.querySelector('.spec');if(sp)sp.remove()}
  var fit=document.createElement('div');fit.id='fit';
  Array.prototype.slice.call(document.body.children).forEach(function(n){if(n.tagName!=='SCRIPT')fit.appendChild(n)});
  document.body.insertBefore(fit,document.body.firstChild);

  // screen transition: slide in when navigating between prototype screens
  (function(){
    var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
    var ref=document.referrer||'',samePage=false;
    try{var u=new URL(ref);samePage=u.origin===location.origin&&!/\/(index\.html)?$/.test(u.pathname)&&u.pathname!==location.pathname}catch(e){}
    var dir=nav.type==='back_forward'?'back':(samePage&&nav.type!=='reload'?'fwd':'');
    if(!dir)return;
    var st=document.createElement('style');
    st.textContent='@keyframes ucInFwd{from{transform:translateX(100%)}to{transform:none}}@keyframes ucInBack{from{transform:translateX(-30%);opacity:.3}to{transform:none;opacity:1}}'+
      '.uc-in-fwd>*:not(.dim):not(.sheet):not(.toast):not(.home){animation:ucInFwd .3s cubic-bezier(.22,.8,.24,1) both}.uc-in-back>*:not(.dim):not(.sheet):not(.toast):not(.home){animation:ucInBack .3s cubic-bezier(.22,.8,.24,1) both}';
    document.head.appendChild(st);
    var ph=document.querySelector('.phone');if(ph)ph.classList.add('uc-in-'+dir);
  })();
  function go(){
    var w=fit.offsetWidth,h=fit.offsetHeight,pad=24;
    var s=Math.min(1,(innerWidth-pad)/w,(innerHeight-pad*2)/h);
    fit.style.transform='translate(-50%,0) scale('+s+')';
  }
  addEventListener('resize',go);go();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);
  var im=fit.querySelectorAll('img');im.forEach(function(i){i.addEventListener('load',go)});
})();
