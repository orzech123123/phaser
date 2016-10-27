// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.


/// <reference path="Game.ts" />
module Application {
    "use strict";

    class Application {
        public Init = () => {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        }

        private onDeviceReady = () => {
            var game = new PhaserGame();
            game.Init();
        }
    }

    window.onload = () => {
        var app = new Application();
        app.Init();
    }
}
