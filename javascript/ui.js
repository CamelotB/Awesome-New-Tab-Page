/** Awesome New Tab Page
  *   antp.co
  *   Copyright 2011-2012 Michael Hart (h4r7.me)
  * Want to make it even more awesome?
  *   github.antp.co
  *
  * Licensed under GPL v3:
  *   http://www.gnu.org/licenses/gpl-3.0.txt
  *   Further Restrictions:
  *     To make use of or modify the below code in any way:
  *     - You agree to leave this copyright and license notice intact without
  *       modification; and
  *     - You agree to mark your modified versions as modified from the original
  *       version; and
  *     - You agree not to misrepresent the origin of this material or your
  *       relationship with the authors of this project or the project itself.
***/


/* START :: Windows */

  $(document).ready(function($) {
    $(".ui-2.container").center();

    $(window).bind('resize scroll', function() {
      $(".ui-2.container").center();
    });
  });

  $(".close,.ui-2.x").live("click", closeButton);

  function closeButton(exclude) {

    if ( exclude && typeof(exclude) === "string" ) {
      $("body > .ui-2, .ui-2#apps, .ui-2#widgets, #recently-closed-tabs-menu")
        .not(exclude)
        .hide();
    } else {
      $("body > .ui-2, .ui-2#apps, .ui-2#widgets, #recently-closed-tabs-menu").hide();
    }

    window.location.hash = "";
    hscroll = true;
  }

  var optionsInit = false;
  $("#config-button, .ui-2.config").live("click", function(){
    if ( !optionsInit ) {
      $(window).trigger("antp-config-first-open");
      optionsInit = true;
    }

    _gaq.push([ '_trackEvent', 'Window', "Config" ]);
    closeButton(".ui-2#config");
    $(".ui-2#config").toggle();
    requiredColorPicker();
    required('/javascript/import-export.js?nocache=12');
  });

  $("#app-drawer-button").live("click", function(){
    _gaq.push([ '_trackEvent', 'Window', "Apps" ]);

    closeButton(".ui-2#apps");
    $(".ui-2#apps").toggle();
  });

  $("#widget-drawer-button").live("click", function(){
    _gaq.push([ '_trackEvent', 'Window', "Widgets" ]);

    closeButton(".ui-2#widgets");
    $(".ui-2#widgets").toggle();
  });

  $("#recently-closed-tabs-menu").live("mouseleave", function() {
    $(this).css("display", "none");
  });

  $("#recently-closed-tabs").live("click", function() {
    _gaq.push([ "_trackEvent", "Window", "Recently Closed Tabs" ]);

    closeButton("#recently-closed-tabs-menu");
    $("#recently-closed-tabs-menu").toggle();
  });

  var aboutInit = false;
  $("#logo-button,.ui-2.logo").live("click", function(){
    _gaq.push([ '_trackEvent', 'Window', "About" ]);

    closeButton(".ui-2#about");
    $(".ui-2#about").toggle();

    if ( !aboutInit ) {
      aboutInit = true;

      (function() {
        var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://api.flattr.com/js/0.6/load.js?mode=auto';
        t.parentNode.insertBefore(s, t);
      })();

      (function() {
        var twitterScriptTag = document.createElement('script');
        twitterScriptTag.type = 'text/javascript';
        twitterScriptTag.async = true;
        twitterScriptTag.src = 'https://platform.twitter.com/widgets.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(twitterScriptTag, s);
      })();

      (function(){
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    }
  });

  $(".ui-2 .drawer-app-uninstall").live("click", function(e){
    var to_delete = null;
    var to_delete_name = null;
    to_delete = $(this).parent();
    to_delete_name = $(to_delete).find(".drawer-app-name").html();

    var r=confirm("Are you sure you want to uninstall " + to_delete_name + "?");
    if (r==true) {
      chrome.management.uninstall($(to_delete).attr("id"), reload() );
    }

    return false;
  });

  /* END :: Windows */

/* START :: Top Left Buttons */


  $(window).bind("antp-config-first-open", function() {
    var option = preference.get("hideLeftButtons");

    $("#hideLeftButtons").attr("checked", option);
    $(document).on("change", "#hideLeftButtons", moveLeftButtons);
  });

  function moveLeftButtons(e) {
    if ( e )
      preference.set("hideLeftButtons", $(this).is(":checked"));

    if ( preference.get("hideLeftButtons") && preference.get("lock") ) {
      $("#top-buttons > div").css("left", "-50px");
      $("#widget-holder,#grid-holder").css("left", "0px");
    }

    if ( !preference.get("hideLeftButtons") ) {
      $("#top-buttons > div").css("left", "0px");
      $("#widget-holder,#grid-holder").css("left", "27px");
    }
  }

  $(document).ready(function($) {
    moveLeftButtons();
  });

  $("#top-buttons").live({
    mouseenter: function() {
      if ( preference.get("hideLeftButtons") ) {
        $("#top-buttons > div").css("left", "0px");
        $("#widget-holder,#grid-holder").css("left", "27px");
      }

    },
    mouseleave: function() {
      if ( preference.get("hideLeftButtons") && preference.get("lock") ) {
        $("#top-buttons > div").css("left", "-50px");
        $("#widget-holder,#grid-holder").css("left", "0px");
      }
    }
  });

  /* END :: Top Left Buttons */

/* START :: Configure */

  $(document).ready(function($) {
    if( window.location.hash ) {
      switch(window.location.hash) {
        case "#options":
          $("#config-button").trigger("click");
          break;
      }
    }

    $(window).bind("antp-config-first-open", function() {
      var option = preference.get("showbmb");

      $("#toggleBmb").attr("checked", option);
      $(document).on("change", "#toggleBmb", updateBookmarkBar);
    });

    bookmark_bar_rendered = false;
    if( preference.get("showbmb") ) {
      $("#toggleBmb").attr('checked', 'checked');
      bookmark_bar_rendered = true;
      required('bookmarkbar', function() {
        chrome.bookmarks.getTree(getBookmarks);
        $("#bookmarksBar").show();
      });
    } else {
      $("#bookmarksBar").hide();
    }

    function updateBookmarkBar(e) {
      if ( e )
        preference.set("showbmb", $(this).is(":checked"));

      if ( preference.get("showbmb") ) {
        if ( bookmark_bar_rendered === false ) {
          bookmark_bar_rendered = true;
          required('bookmarkbar', function() {
            chrome.bookmarks.getTree(getBookmarks);
          });
        }

        $("#bookmarksBar").show();
        preference.set("showbmb", true);
        moveGrid({ "animate_top": true });
      } else {
        $("#bookmarksBar").hide();
        preference.set("showbmb", false);
        moveGrid({ "animate_top": true });
      }
    }

    if(localStorage.getItem("bg-img-css") && localStorage.getItem("bg-img-css") !== "") {
      $("body").css("background", localStorage.getItem("bg-img-css") );
      $("#bg-img-css").val( localStorage.getItem("bg-img-css") );
    }
  });

  $(document).ready(function($) {
    $("#amazon-locale-selection").val(localStorage.getItem("amazon-locale") || "amazon.com");
    $("#amazon-locale-selection").change(function() {
      localStorage.setItem("amazon-locale", $(this).val());
    });
  });

  $(".bg-color").css("background-color", "#" + (localStorage.getItem("color-bg") || "221f20"));


  $("#bg-img-css").live("keyup change", function() {
    $("body").css("background", "" );
    $("body").css("background", $(this).val() );
    $(".bg-color").css("background-color", '#' + (localStorage.getItem("color-bg") || "221f20") );

    if($(this).val() === "") {
      $(".bg-color").css("background-color", "#" + (localStorage.getItem("color-bg") || "221f20"));
    }

    localStorage.setItem("bg-img-css", $(this).val() );
  });

  // Clears localStorage
  $("#reset-button").live("click", function() {
    var reset = confirm( chrome.i18n.getMessage("ui_confirm_reset") );
    if ( reset === true ) {
      deleteShortcuts();
      deleteRoot();
      localStorage.clear();
      _gaq.push(['_trackEvent', 'Reset', chrome.app.getDetails().version]);

      setTimeout(function() {
        reload();
      }, 250);
    } else {
      $.jGrowl("Whew! Crisis averted!", { header: "Reset Cancelled" });
    }
  });

  $(window).bind("antp-config-first-open", function() {
    var
      gridwidth = preference.get("grid-width"),
      gridheight = preference.get("grid-height");

    $("#grid-width").val(gridwidth);
    $("#grid-height").val(gridheight);
    $(document).on("change", "#grid-width, #grid-height", updateGridSize);
  });

  function updateGridSize(e) {
    if ( e ) {
      var value = $(this).val();

      if ($(this).attr("id") === "grid-width") {
        value  = (value < 4) ? 4 : value;
        value  = (value > 50) ? 50 : value;
        $(this).val(value);
      }

      if ($(this).attr("id") === "grid-height") {
        value  = (value < 3) ? 2 : value;
        value  = (value > 25) ? 25 : value;
        $(this).val(value);
      }

      preference.set($(this).attr("id"), $(this).val());
    }
  }

  /* END :: Configure */

/* START :: Hide Scrollbar */

  $(window).bind("antp-config-first-open", function() {
    var
      hideScrollbar = $("#hide-scrollbar"),
      option = preference.get("hideScrollbar");
    hideScrollbar.attr("checked", option);

    $(document).on("change", "#hide-scrollbar", updateScrollBarVisibility);
  });

  function updateScrollBarVisibility(e) {
    if ( e )
      preference.set("hideScrollbar", $(this).is(":checked"));

    if ( preference.get("hideScrollbar") ) {
      $("body").css("overflow-x", "hidden");
    } else {
      $("body").css("overflow-x", "");
    }
  }
  updateScrollBarVisibility();

  /* END :: Hide Scrollbar */

function colorPickerLoaded() {
  // background color picker
  $("#colorselector-bg").ColorPicker({
    color: '#' + ( localStorage.getItem("color-bg") || "221f20") ,
    onShow: function (colpkr) {
      $(colpkr).fadeIn(500);
      return false;
    },
    onHide: function (colpkr) {
      $(colpkr).fadeOut(500);
      return false;
    },
    onChange: function (hsb, hex, rgb) {
      $(".bg-color").css('background-color', '#' + hex);
      localStorage.setItem("color-bg", hex);
    }
  });
}

// drag/drop bookmarks to empty tiles
$(".tile").bind({
  "dragover": function(e) {
    var srcElement = $(e.srcElement);
    if (srcElement.filter(".tile.empty.tile-grid").length == 1) {
      srcElement.addClass("filesystem-drop-area");
    }
    return false;
  },
  "dragleave": function(e) {
    var srcElement = $(e.srcElement);
    srcElement.removeClass("filesystem-drop-area");
    return false;
  },
  "drop": function(e) {
    var srcElement = $(e.srcElement);
    srcElement.removeClass("filesystem-drop-area");
    if (srcElement.filter(".tile.empty.tile-grid").length == 1) {
      if (e.originalEvent.dataTransfer.items.length > 0) {
        var url = e.originalEvent.dataTransfer.getData("URL");
        if (url !== null && url !== "") {
          required('/javascript/tile-editor.js?nocache=12', function() {  // ensure tile-editor.js is loaded
            createShortcut(e.srcElement);
            $("[ng-model='$parent.$parent.appLaunchUrl']").val(url).change();
            $("[ng-model='$parent.$parent.name']").val("").change();
            $("[ng-model='$parent.$parent.name']").focus();
          });
        }
      }
    }
    return false;
  }
});

// upon new app installed
function showAppsWindow () {
  $(".ui-2#apps").show();

  required('/javascript/jquery.qtip.min.js', function() {
    $(document).ready(function() {
      $(document.body).qtip({
        id: 'app-tip', // Give it an ID of qtip-step so we an identify it easily
        content: {
          text: chrome.i18n.getMessage("ui_apps_tip_message"),
          title: {
            text: chrome.i18n.getMessage("ui_apps_tip_message_title"),
            button: true
          }
        },
        position: {
          my: 'left center',
          at: 'right center',
          target: $('#app-drawer-button'), // Also use first steps position target...
          viewport: $(window) // ...and make sure it stays on-screen if possible
        },
        show: {
          event: false,
          ready: true
        },
        hide: {
          event: 'unfocus'
        }
      });

      $('#qtip-app-tip').triggerHandler(this.id);
    });
  });
}
