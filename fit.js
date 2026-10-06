(function(){
  var st=document.createElement('style');
  st.textContent='html,body{height:100%;overflow:hidden}body{display:block!important;position:relative;min-height:0!important}#fit{position:absolute;left:50%;top:50%;display:flex;align-items:center;gap:28px;transform-origin:center center}';
  document.head.appendChild(st);
  if(/nospec/.test(location.search)){var sp=document.querySelector('.spec');if(sp)sp.remove()}
  var fit=document.createElement('div');fit.id='fit';
  Array.prototype.slice.call(document.body.children).forEach(function(n){if(n.tagName!=='SCRIPT')fit.appendChild(n)});
  document.body.insertBefore(fit,document.body.firstChild);
  function go(){
    var w=fit.offsetWidth,h=fit.offsetHeight,pad=24;
    var s=Math.min(1,(innerWidth-pad)/w,(innerHeight-pad)/h);
    fit.style.transform='translate(-50%,-50%) scale('+s+')';
  }
  addEventListener('resize',go);go();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);
  var im=fit.querySelectorAll('img');im.forEach(function(i){i.addEventListener('load',go)});
})();
