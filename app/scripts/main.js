/* ========================================================= *
 * Plugin: bs.push.nav v0.0.4
 * Author: Mohamed Hassan 'pencilpix'.
 * Author Url: mohamedhassan.me
 * License: under MIT
 * ========================================================= */

;(function($, window, document, undefined){
  'use strict';
  // define the plugin name and the default options
  var resizeDelay;
  var randomNo;
  var backdrop    = '<div class="bsPushNav-backdrop"></div>';
  var pluginName  = 'bsPushNav';
  var defaults    = {
                      breakpoint: 768,
                      typeClass: 'slide',
                      direction: 'left',
                      targetsList: [],
                      templates: {},
                      bodyWrapper: '#wrapper'
                    };

  // define the plugin constructor
  function Plugin(element, options){
    this.element = element;
    this._name = pluginName;
    this._defaults = defaults;
    this.options = $.extend({}, defaults, options);

    this.init();
  }
  // to hold the structure of each menu wrapper
  Plugin.menuWrapper = '';

  // to hold if menu enabled or disabled
  Plugin.enabled = false;

  // random ids
  function randomIdNo() {
    return  Math.floor(Math.random() * 1000);
  }

  Plugin.prototype.init = function(){
    var $element = $(this.element);
    var lists = this.options.targetsList;
    randomNo = this.randomNo = randomIdNo();
    this.isShown = false;
    this.menuWrapper = '<nav id="bsPushNav' + randomNo + '" class="bsPushNav"></nav>';
    $element.attr('id', 'bsPushNav' + randomNo + '_btn')
                  .data('control', '#bsPushNav' + randomNo);
    this.options.targetsList = (lists.length === 0) ? $element.data('target').split(' ') : lists;
    // do the logic
    this.getLists.call(this);
    this.bindResize.call(this);

    if(this.options.typeClass === 'push'){
      $('body').addClass('anim');
    }

    if(this.checkWidth.call(this)) {
      this.addTemp.call(this);
    }
    this.bindClick.call(this);
    this.handleResize.call(this);
  };

  Plugin.prototype.getLists = function() {
    // get the template of each list and its parent.
    var templates = {};
    var lists = this.options.targetsList;
    for (var li in lists){
      $(lists[li]).parent().addClass('parent-' + randomNo + '-' + lists[li].replace('#', ''));
      templates[lists[li].replace('#', '')] = {
        parent: '.' + $(lists[li]).parent().attr('class').replace(/ /g, '.'),
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

    if($(this.options.bodyWrapper).length === 0){
      $('body').contents().not('script').wrapAll('<div id="' + this.options.bodyWrapper.replace('#', '') + '"></div>');
    }

    if ($($element.data('control')).length === 0){
      $(this.options.bodyWrapper).prepend(this.menuWrapper);
    }
    $($element.data('control')).addClass(this.options.direction + ' ' + this.options.typeClass);

    for (var temp in temps){
      $($element.data('control')).append(temps[temp].template);
    }

    if(!this.enabled){
      this.enabled = true;
      this.triggerEvent('menuEnabled', [$element, $($element.data('control'))]);
    }
  };

  Plugin.prototype.removeTemp = function() {
    var temps = this.options.templates;
    var $element = $(this.element);
    $('.bsPushNav-backdrop, ' + $element.data('control')).remove();
    $('body').removeClass('pn-' + this.options.typeClass + '-' + this.options.direction);
    for(var temp in temps){
      if($('#' + temp).length === 0){
        $(temps[temp].parent).append(temps[temp].template);
      }
    }

    if(this.enabled){
      this.enabled = false;
      this.triggerEvent('menuDisabled', [$element, $($element.data('control'))]);
    }
  };

  Plugin.prototype.show = function(){
    var $element = $(this.element);
    if(!this.isShown){
      $($element.data('control')).addClass('active');
      $('body').addClass('pn-' + this.options.typeClass + '-' + this.options.direction);
      if($('.bsPushNav-backdrop').length === 0){
        $(this.options.bodyWrapper).append(backdrop);
      }

      this.isShown = true;
      this.triggerEvent('shown', [$element, $($element.data('control'))]);
    }
  };

  Plugin.prototype.hide = function(){
    var $element = $(this.element);
    $($element.data('control')).removeClass('active');
    $('body').removeClass('pn-' + this.options.typeClass + '-' + this.options.direction);
    $('.bsPushNav-backdrop').remove();

    this.isShown = false;
    this.triggerEvent('hidden', [$element, $($element.data('control'))]);
  };

  Plugin.prototype.bindClick = function(){
    var plugin = this;
    var btn = '#bsPushNav' + randomNo + '_btn';
    var selector =  '#' + $(plugin.element).attr('id') + ', .bsPushNav-backdrop';
    $(document).on('click' + '.' + plugin._name, selector, function(e){
      var target = $(e.target);
      if(target.is(btn)) { e.preventDefault(); }
      if(target.is(btn) || target.is($(btn).find('*'))) {
        if(plugin.checkWidth()){
          plugin.triggerEvent('beforeShow', [$(btn), $($(btn).data('control'))]);
          plugin.show();
        }
      } else if(plugin.isShown) {
        plugin.triggerEvent('beforeHide', [$(btn), $($(btn).data('control'))]);
        plugin.hide();
      }
    });
  };

  Plugin.prototype.bindResize = function(){
    var plugin = this;
    var $element = $(plugin.element);
    var dataSelector = $element.data('toggle');

    if(!dataSelector || dataSelector !== plugin._name) { $element.data('toggle', plugin._name); }
    $(window).on('resize' + '.' + plugin._name, function(){
      clearTimeout(resizeDelay);
      resizeDelay = setTimeout(function(){
        plugin.triggerEvent('windowResize', [$('[data-toggle="' + plugin._name + '"]')]);
      }, 250);
    });
  };

  // when window is resized handle the template
  Plugin.prototype.handleResize = function() {
    var plugin = this;
    var btn = '#bsPushNav' + randomNo + '_btn';
    $(btn).on('windowResize' + '.' + plugin._name, function(){
      if(plugin.checkWidth()){
        plugin.addTemp.call(plugin);
      } else {
        plugin.removeTemp.call(plugin);
      }
    });
  };

  Plugin.prototype.triggerEvent = function(eventName, elAr){
    for (var el in elAr){
      elAr[el].trigger(eventName);
    }
  };

  Plugin.prototype.destroy = function(){
    // the logic of destroy the plugin
    this.removeTemp.call(this);
    this.unbindEvents();
    $(this.element).removeData();
  };

  Plugin.prototype.unbindEvents = function() {
      // unbind events of the element
      var plugin = this;
      var selector = $(plugin.element).attr('id') + ', .bsPushNav-backdrop';
      $(document).off('.' + plugin._name, '#' + selector);
      $(this.element).off('.' + plugin._name);
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
