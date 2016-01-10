var five = require("johnny-five");
var board = new five.Board({
 debug:false, repl: false
});



board.on("ready", function() {
  /**
  * In order to use the Stepper class, your board must be flashed with
  * either of the following:
  *
  * - AdvancedFirmata https://github.com/soundanalogous/AdvancedFirmata
  * - ConfigurableFirmata https://github.com/firmata/arduino/releases/tag/v2.6.2
  *
  */
  var stepper = new five.Stepper({
   type: five.Stepper.TYPE.DRIVER,
   stepsPerRev: 3200,
   pins: [13, 12]
  });
  var pin = new five.Pin(11);
  var photoSensor = new five.Pin('A0');
  var toggleSwitch = new five.Switch(11);
  //  toggleSwitch.on("close", function() {
  //    console.log("closed");
  //  });
  //  toggleSwitch.on("open", function() {
  //    console.log("open");
  //  });
  var led = new five.Led(10);
  var k = 0;

  var i =0;

  setInterval(function(){ led.toggle(); }, 1000)

  function go(){

    i++;

    pin.query(function(state) {

      photoSensor.query(function(state2){

        process.stdout.write("light state: " + state2.value + " switch state: " + state.value + "       \r");
        if((state.value==0) && (state2.value > 900)){
          stepper.ccw().step(128, function() {
            setTimeout(go,100);
          });
        }
        else {
          setTimeout(go,100);
        }
      });
    });

  }
  go();

});
