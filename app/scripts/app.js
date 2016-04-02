/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    //Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    //Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    //Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  app.setAppProperty = function(property, newValue) {
    app[property] = newValue;
  };

  app.defaultShoppingCartImage = "../images/dox-kiosk-images/placeholder.png";
  //http://www.dpcfilms.com/word/wp-content/themes/lcp/images/default/placeholder.gif

  app.marketingImages = [
    "images/dox-kiosk-images/marketing1.png",
    "images/dox-kiosk-images/marketing2.png",
    "images/dox-kiosk-images/marketing3.png",
    "images/dox-kiosk-images/marketing4.png"
  ];

  app.hardGoodImages = [
    "images/dox-kiosk-images/headphonest_product.png",
    "images/dox-kiosk-images/360vr_product.png",
    "images/dox-kiosk-images/bot_product.png",
    "images/dox-kiosk-images/watch_product.png"
  ];

  app.hardGoodImagesThumbnails = [
    "images/dox-kiosk-images/headphones_thumb.png",
    "images/dox-kiosk-images/360vr_product_thumb.png",
    "images/dox-kiosk-images/bot_thumb.png",
    "images/dox-kiosk-images/watch_thumb.png"
  ];

  app.getMarketingImageByIndex = function(index) {
    return app.marketingImages[index];
  };

  app.getHardGoodImageByIndex = function(index) {
    return app.hardGoodImages[index];
  };

  app.setButtonText = function(buttonID, newText) {
    var button = document.getElementById(buttonID);
    button.setAttribute("secondary-text", newText);
  };

  app.addToShoppingCart = function(imageNumber) {
    var imageSlots = document.getElementsByClassName("img-carousel");
    for (var i=0; i<imageSlots.length; i++) {
      if (imageSlots[i].getAttribute("src") === app.defaultShoppingCartImage) {
        imageSlots[i].setAttribute("src", app.hardGoodImagesThumbnails[imageNumber]);
        break;
      }
    }
    app.enableCheckout();
    app.shoppingCartItemCount++;

    if (app.shoppingCartItemCount > 4) {
      app.shoppingCartItemCount = 4;
    }

    app['hideRemoveButton'+app.shoppingCartItemCount] = false;
  };

  app.removeFromShoppingCart = function(imageNumber) {
    var imageSlots = document.getElementsByClassName("img-carousel");

    for (var i=imageNumber; i<imageSlots.length; i++) {
      if (imageSlots[i].getAttribute("src") !== app.defaultShoppingCartImage) {
        if ((i+1) === imageSlots.length) {
          imageSlots[i].setAttribute("src", app.defaultShoppingCartImage);
        } else {
          imageSlots[i].setAttribute("src", imageSlots[i+1].getAttribute("src"));
        }
      }
    }

    var itemsInCart = false;
    for (var i=0; i<imageSlots.length; i++) {
      if (imageSlots[i].getAttribute("src") !== app.defaultShoppingCartImage) {
        itemsInCart = true;
        break;
      }
    }
    if (itemsInCart) {
      app.enableCheckout();
    } else {
      app.disableCheckout();
    }

    app['hideRemoveButton'+app.shoppingCartItemCount] = true;

    app.shoppingCartItemCount--;
    if (app.shoppingCartItemCount < 0) {
      app.shoppingCartItemCount = 0;
    }
  };

  app.clearShoppingCart = function() {
    var imageSlots = document.getElementsByClassName("img-carousel");
    for (var i=0; i<imageSlots.length; i++) {
      imageSlots[i].setAttribute("src", app.defaultShoppingCartImage);
    }
    app.disableCheckout();
  };

  app.enableCheckout = function() {
    app.highlightCheckout = "true";
    app.shoppingCartImage = "checkout";
  };

  app.disableCheckout = function() {
    app.highlightCheckout = "disable";
    app.shoppingCartImage = "checkout-disabled";
  };

  app.initApp = function() {
    app.highlightBuy = null;
    app.highlightPickup = "true";
    app.highlightAccount = null;

    app.pickupImage = "pickup";
    app.shoppingCartImage = "checkout-disabled";
    app.disableCheckout();

    app.playVideo = "true";
    app.hideLiveChat = true;

    app.hideUsage = true;
    app.hideBilling = false;

    app.usageHighlight = "false";
    app.billingHighlight = "disable";

    app.hideProduct1 = false;
    app.hideProduct2 = true;
    app.hideProduct3 = true;
    app.hideProduct4 = true;

    app.initShoppingCart();
  };

  app.initShoppingCart = function() {
    app.hideRemoveButton1 = true;
    app.hideRemoveButton2 = true;
    app.hideRemoveButton3 = true;
    app.hideRemoveButton4 = true;

    app.shoppingCartItemCount = 0;
    app.clearShoppingCart();
  }

  app.initApp();

})(document);
