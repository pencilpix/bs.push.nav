### bs.push.nav
JQuery plugin depend on bootstrap navigation to convert it into a push/slide menu for small screen widths

#### Dependancies
  * jquery 2.X
  * bootstrap 3.X

#### Installation:
you can use bower to install bs.push.nav using the following command.

```
  $ bower install bs-push-nav --save
```

or manually via downloading repository of the plugin and attach the required files to make it work.
include CSS just after bootstrap.css files at your `<head>`

```
  <link rel="stylesheet" href="dist/styles/jquery.bs.push.nav.min.css"/>
```

then include JS file after jquery and bootstrap.js at the bottom of your `<body>` or at you set you js files to be.

```
  <script src="dist/scripts/jquery.bs.push.nav.min.js"></script>
```

all html structure required is a button that trigger the menus you want to convert into push/slide at given breakpoint

```
  <button type="button" class="navbar-toggle" data-toggle="bsPushNav" data-target="#menu1 #menu2" aria-expanded="false">
    <span class="sr-only">Toggle navigation</span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
  </button>
  <!-- call the plugin -->
  <script>
    jQuery(document).ready(function($) {
      $('.navbar-toggle').bsPushNav();
    });
  </script>

```

#### Options
bs.push.nav has many options that makes you control your menus
```
  <script>
    jQuery(document).ready(function($) {
      var options = {
        breakpoint: 768, // the breakpoint that determine the screen width to convert menus
        typeClass: 'slide', // the default type menu is 'slide' you can set it to 'push'
        targetsList: ['#menu1', '#menu2'], // or you can set it via data-target="#menu1 #menu2"
        direction: 'left' // the default direction, also you can set it to right
      };

      $('.navbar-toggle').bsPushNav(options);
    });
  </script>
```

#### Events

Event           | Description                                                             
--------------- | ------------------------------------------------------------------------
triggered       | that event will be triggered when the window hit the breakpoint 
fired           | triggerd when window is resized and break the breakpoint.
beforeShow      | triggered when the button is clicked just before the menu is shown
shown           | triggered when the menu is shown
beforeHide      | triggered just before the menu is hidden
Hidden          | triggered after hiding the menu

#### Methods

Method           | Description                                                            
---------------- | -----------------------------------------------------------------------
'show'           | shows the menu
'hide'           | hides the menu
'destroy'        | destroy and dettach all events applied to the plugin instance

#### Upcomming features
  * support (RTL) for the menus.
  * support multi-push/slide menu at the same page.
  * Enable required Events that should be triggered at each process.


