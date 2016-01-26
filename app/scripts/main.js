;(function($, window, document, undefined){
  'use strict';
  // define the plugin name and the default options
  var pluginName = 'bsPushNav';
  var defaults = {

      };

  // define the plugin constructor
  function Plugin(element, options){
    this.element = element;
    this._name = pluginName;
    this._defaults = defaults;
    this.options = $.extend({}, defaults, options);

    this.init();
  }

  Plugin.prototype.init = function(){
    // do the logic
  };

  Plugin.prototype.show = function(){
    // public method that fires some event
  };

  Plugin.prototype.bindEvent = function(){
    var plugin = this;
    $(plugin.element).on('click' + '.' + plugin._name, function(e){
      e.preventDefault();

      // bind click event
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
