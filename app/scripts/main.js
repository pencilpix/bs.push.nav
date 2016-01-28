/* ========================================================= *
 * Plugin: bs.push.nav v0.0.3
 * Author: Mohamed Hassan 'pencilpix'.
 * Author Url: mohamedhassan.me
 * License: under MIT
 * ========================================================= */

;(function($, window, document, undefined){
  'use strict';
  // define the plugin name and the default options
  var resizeDelay;
  var randomNo;
  var menuWrapper;
  var $menuBtn    = $('[data-toggle="bsPushNav"]');
  var breakpoint  = $menuBtn.data('breakpoint');
  var menuDir     = $menuBtn.data('direction');
  var menuType    = $menuBtn.data('type');
  var backdrop    = '<div class="bsPushNav-backdrop"></div>';
  var pluginName  = 'bsPushNav';
  var defaults    = {
                    breakpoint: (breakpoint) ? breakpoint : 768,
                    typeClass: (menuType) ? menuType : 'slide',
                    direction: (menuDir) ? menuDir : 'left',
                    targetsList: [],
                    templates: {}
                  };

  // define the plugin constructor
  function Plugin(element, options){
    this.element = element;
    this._name = pluginName;
    this._defaults = defaults;
    this.options = $.extend({}, defaults, options);

    this.init();
  }

  // random ids
  function randomIdNo() {
    return  Math.floor(Math.random() * 1000);
  }

  Plugin.prototype.init = function(){
    randomNo = this.randomNo =randomIdNo();
    this.isShown = false;
    menuWrapper = '<nav id="bsPushNav' + randomNo +'" class="bsPushNav"></nav>';
    $(this.element).attr('id','bsPushNav' + randomNo + '_btn')
                  .data('control', '#bsPushNav' + randomNo);
    this.options.targetsList = (this.options.targetsList.length === 0) ? $(this.element).data('target').split(' ') : this.options.targetsList;
    // do the logic
    this.getLists.call(this);
    this.bindResize.call(this);
    if(this.checkWidth.call(this)) {
      if(this.options.typeClass === 'push'){
        $('body').addClass('anim');
      }
      this.addTemp.call(this);
    }
  };

  Plugin.prototype.getLists = function() {
    // get the template of each list and its parent.
    var templates = {};
    var lists = this.options.targetsList;
    for (var li in lists){
      templates[lists[li].replace('#', '')] = {
        parent: '.' + $(lists[li]).parent().attr('class'),
        id: templates[lists[li]],
        template: $(lists[li]).clone()
      };
    }

    this.options.templates = templates;
  };

  // check if the window width < the breakpoint
  Plugin.prototype.checkWidth = function() {
    return $(window).width() <= this.options.breakpoint;
  };

  Plugin.prototype.addTemp = function() {
    var temps = this.options.templates;
    var lists = this.options.targetsList;
    var $element = $(this.element);
    for(var li in lists) {
      $(lists[li]).remove();
    }

    if ($($element.data('control')).length === 0){
      $('body').prepend(menuWrapper);
    }
    $($element.data('control')).addClass(this.options.direction + ' ' + this.options.typeClass);

    for (var temp in temps){
      $($element.data('control')).append(temps[temp].template);
    }

    this.bindClick.call(this);
  };

  Plugin.prototype.removeTemp = function() {
    var temps = this.options.templates;
    $('.bsPushNav-backdrop, #bsPushNav' + randomNo).remove();
    $('body').removeClass('pn-' + this.options.typeClass + '-' + this.options.direction);

    for(var temp in temps){
      if($(temps[temp].id).length === 0){
        $(temps[temp].parent).append(temps[temp].template);
      }
    }

  };

  Plugin.prototype.show = function(){
    var $element = $(this.element);
    if(!this.isShown){
      $($element.data('control')).addClass('active');
      $('body').addClass('pn-' + this.options.typeClass + '-' + this.options.direction);
      if($('.bsPushNav-backdrop').length === 0){
        $('body').append(backdrop);
      }

      this.isShown = true;
    }
  };

  Plugin.prototype.hide = function(){
    var $element = $(this.element);
    $($element.data('control')).removeClass('active');
    $('body').removeClass('pn-' + this.options.typeClass + '-' + this.options.direction);
    $('.bsPushNav-backdrop').remove();

    this.isShown = false;
  };

  Plugin.prototype.bindClick = function(){
    var plugin = this;
    var btn = '#bsPushNav' + randomNo + '_btn';
    $(document).on('click' + '.' + plugin._name, function(e){
      e.preventDefault();
      var target = $(e.target);
      // fire an event before show
      if(target.is(btn) || target.is($(btn).find('*'))) {
        if(plugin.checkWidth()){
          plugin.show();
        }
      } else if(plugin.isShown) {
        plugin.hide();
      }
    });
  };

  Plugin.prototype.bindResize = function(){
    var plugin = this;
    $(window).on('resize' + '.' + plugin._name, function(){
      clearTimeout(resizeDelay);
      resizeDelay = setTimeout(function(){
        if(plugin.checkWidth.call(plugin)){
          plugin.addTemp.call(plugin);
        } else {
          plugin.removeTemp.call(plugin);
        }
      }, 250);
    });
  };

  Plugin.prototype.destroy = function(){
    // the logic of destroy the plugin
    this.unbindEvents();
    $(this.element).removeData();
  };

  Plugin.prototype.unbindEvents = function() {
      // unbind events of the element
      $(this.element).off('.' + this._name);
  };


  // init the plugin
  $.fn[pluginName] = function ( options ) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);

        if (instance instanceof Plugin && typeof instance[options] === 'function') {
          returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }

        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });

      return returns !== undefined ? returns : this;
    }
  };
})(jQuery, window, document);
