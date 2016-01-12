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
  var ac = new five.Pin(5);
  var acPolarity = new five.Pin(6);
  //  toggleSwitch.on("close", function() {
  //    console.log("closed");
  //  });
  //  toggleSwitch.on("open", function() {
  //    console.log("open");
  //  });
  var led = new five.Led(10);
  var k = 0;

  var i =0;

  var accDir = 0;
  var accOn = 0;

  var iCount = 0

  function acc(){

    if (iCount == 0){
      acPolarity.low();
      ac.high();
    }
    else if (iCount == 10){
      acPolarity.high();

    }
    else if (iCount == 20){

      ac.low();
    }
    else if (iCount == 3){

    }
    else if (iCount == 100){
      iCount =-1;
    }
    iCount ++
  }

  setInterval(acc, 50);

  setInterval(function(){ led.toggle(); }, 1000)

  function go(){

    i++;

    pin.query(function(state) {

      photoSensor.query(function(state2){

        process.stdout.write("light state: " + state2.value + " switch state: " + state.value +" icount: "+iCount+"       \r" );
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
