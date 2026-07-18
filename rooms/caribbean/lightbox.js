/* shared lightbox for port pages */
(function(){
  var lb=document.getElementById('lightbox'),li=document.getElementById('lb-img'),lc=document.getElementById('lb-cap');
  if(!lb) return;
  function close(){lb.classList.remove('active');li.src='';}
  document.querySelectorAll('.hang').forEach(function(h){
    var img=h.querySelector('.photo img'),t=h.querySelector('.exhibit-label .t'),d=h.querySelector('.exhibit-label .d');
    if(img) img.addEventListener('click',function(){
      li.src=img.src;li.alt=img.alt||'';lc.textContent=(t?t.textContent:'')+(d?' — '+d.textContent:'');lb.classList.add('active');
    });
  });
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.getElementById('lb-close').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();
