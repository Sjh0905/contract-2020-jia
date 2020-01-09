!function(n){
  var  e=n.document,
    t=e.documentElement,
    i=37.5,
    d=i/5,
    o="orientationchange"in n?"orientationchange":"resize",
    a=function(){
      var n=t.clientWidth||375;
      if(n>768) {t.style.fontSize="10px"}
      else {t.style.fontSize=n/d+"px"}

    };
  e.addEventListener&&(n.addEventListener(o,a,!1),e.addEventListener("DOMContentLoaded",a,!1))
}(window);
