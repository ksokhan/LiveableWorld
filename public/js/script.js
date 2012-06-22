// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || []; // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


$(function() {
  // simply show the 'This is in development' screen.
  /*if(sessionStorage && !sessionStorage.getItem('dev_notice')) {
    $('#dev_notice').modal({
      show: true,
      backdrop: true
    });
  }*/

  // show background on homepage:
  if ($('body').hasClass('bgimage')) $.backstretch("/lib/images/bg3.jpg", {speed: 500, centeredY: false});


  // sticky nav bar when scroll past
  if ($('.bar.inline').length > 0)
  {
    var navbar = $('.bar.inline');
    var savepos = 0;
    $(window).bind("scroll resize", function() {
      var a = $(this).scrollTop();
      var b = navbar.offset().top;
      if (a > b - 9) {
        navbar.parent().height(navbar.parent().height()); // force height to current height
        savepos = b; // record position vertically so that we dont have to calculate anymore
        navbar.addClass('stay');
      }
      else if (a < savepos - 10 && savepos != 0) {navbar.removeClass('stay');}
    }).trigger('resize');
  }

});
