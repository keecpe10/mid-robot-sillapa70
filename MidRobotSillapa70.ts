/**
  * Enumeration of ReadADC.
  */
enum ADC {
    //% block="ADC 0"
    ADC0 = 132,
    //% block="ADC 1"
    ADC1 = 196,
    //% block="ADC 2"
    ADC2 = 148,
    //% block="ADC 3"
    ADC3 = 212,
    //% block="ADC 4"
    ADC4 = 164,
    //% block="ADC 5"
    ADC5 = 228,
    //% block="ADC 6"
    ADC6 = 180,
    //% block="ADC 7"
    ADC7 = 244
}

/**
  * Enumeration of SpinMotor.
  */
enum DirectionSpin {
    //% block="ซ้าย \u21f5"
    LEFT,
    //% block="ขวา \u21c5"
    RIGHT
}

enum RobotButton {
    //% block="A"
    A,
    //% block="B"
    B
}

/**
  * Enumeration of เซ็นเซอร์.
  */
enum SensorPanel {
    //% block="ด้านหน้า 0-5"
    FRONT,
    //% block="ด้านหลัง 6-7"
    BLACK
}

/**
  * Enumeration of หมายเลขเซ็นเซอร์.
  */
enum SensorNumber {
    //% block="0"
    Number0 = 0,
    //% block="1"
    Number1 = 1,
    //% block="2"
    Number2 = 2,
    //% block="3"
    Number3 = 3,
    //% block="4"
    Number4 = 4,
    //% block="5"
    Number5 = 5,
    //% block="6"
    Number6 = 6,
    //% block="7"
    Number7 = 7
}

// Add your code here
/**
 * Custom blocks /f23c monster /f2d6 นักบินอวกาศ /f2dd
 */
//% weight=100 color=#2FE7F0 icon="\uf0fb"

namespace MidRobot {
    let Sensors: ADC[] = [ADC.ADC0, ADC.ADC1, ADC.ADC2, ADC.ADC3, ADC.ADC4, ADC.ADC5, ADC.ADC6, ADC.ADC7]
    let SetValueSensors: number[] = []
    let MinValueSensors: number[] = []
    let MaxValueSensors: number[] = []
    let AvgValueSensors: number[] = []


    /**ReadADC for read analog sensor, Select ADC channel 0-7.
          *
          */
    //% blockId="MidRobot_readADC" block="อ่านค่าเซ็นเซอร์ %ADC"
    //% subcategory=พื้นฐาน
    //% group="พื้นฐาน"
    //% weight=100
    export function ReadADC(ReadADC: ADC): number {
        let ADCValue: number

        pins.i2cWriteNumber(
            72,
            ReadADC,
            NumberFormat.UInt8LE,
            false
        )
        return ReadADC = pins.i2cReadNumber(72, NumberFormat.UInt16BE, false)
    }

    /** ความเร็วมอเตอร์ มอเตอร์1,มอเตอร์2   
          * @param left_speed percent of maximum left_speed, eg: 50
          * @param right_speed percent of maximum right_speed, eg: 50
          */
    //% blockId="MidRobot_set_motors" block="set_motors | left_speed %left_speed | right_speed %right_speed"
    //% Speed.min=0 Speed.max=100
    //% subcategory=พื้นฐาน
    //% group="พื้นฐาน"
    //% weight=99
    function set_motors(left_speed: number, right_speed: number): void {
        left_speed = pins.map(left_speed, 0, 100, 0, 1023)
        right_speed = pins.map(right_speed, 0, 100, 0, 1023)
        //Forward
        if (right_speed >= 0 && left_speed >= 0) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P14, left_speed)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.analogWritePin(AnalogPin.P16, right_speed)
        }
        if (right_speed >= 0 && left_speed < 0) {
            left_speed = -left_speed
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.analogWritePin(AnalogPin.P14, left_speed)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.analogWritePin(AnalogPin.P16, right_speed)
        }
        if (right_speed < 0 && left_speed >= 0) {
            right_speed = -right_speed
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P14, left_speed)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P16, right_speed)
        }
    }

    /**หมุน
     * @param speed percent of maximum speed, eg: 50
      * @param time percent of maximum time, eg: 500
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_spin block="หมุน %direction| ความเร็ว %speed เวลา %time ms"
    //% speed.min=0 speed.max=100
    //% time.min=0
    //% subcategory=พื้นฐาน
    //% group="พื้นฐาน"
    //% inlineInputMode=inline
    //% weight=98
    export function spin(direction: DirectionSpin, speed: number, time: number): void {
        if (direction == DirectionSpin.LEFT) {
            let previousMillis = input.runningTime()
            while (input.runningTime() - previousMillis < time) {
                set_motors(-speed, speed)
            }
        }
        if (direction == DirectionSpin.RIGHT) {
            let previousMillis = input.runningTime()
            while (input.runningTime() - previousMillis < time) {
                set_motors(speed, -speed)
            }
        }
    }

    /** รอการกดปุ่ม  
             */
    //% blockId="MidRobot_รอการกดปุ่ม" block="รอการกดปุ่ม | %button"
    //% subcategory=พื้นฐาน
    //% group="พื้นฐาน"
    //% weight=97
    //% blockGap=8
    export function waitButtonPress(button: RobotButton): void {
        if (button == RobotButton.A) {
            while (!(input.buttonIsPressed(Button.A))) {
                basic.showArrow(ArrowNames.West)
            }
        }
        if (button == RobotButton.B) {
            while (!(input.buttonIsPressed(Button.B))) {
                basic.showArrow(ArrowNames.East)
            }
        }
    }

    ///////////////ระดับกลาง////////////////////////////////
    /**อ่านค่าเซ็นเซอร์
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_ReadSensorPanel block="แสดงค่าเซ็นเซอร์ %panel"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% inlineInputMode=inline
    //% weight=100
    export function ReadSensorPanel(panel: SensorPanel): void {
        if (panel == SensorPanel.FRONT) {
            serial.writeLine("" + ReadADC(Sensors[0])
                +" : "+ ReadADC(Sensors[1])
                + " : " + ReadADC(Sensors[2])
                + " : " + ReadADC(Sensors[3])
                + " : " + ReadADC(Sensors[4])
                + " : " + ReadADC(Sensors[5]))
        }
        if (panel == SensorPanel.BLACK) {
            serial.writeLine("" + ReadADC(Sensors[6])
                + " : " + ReadADC(Sensors[7]))
        }
    }

    /**กำหนดค่าเซ็นเซอร์
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_SetSensorValue block="กำหนดค่าเซ็นเซอร์ %numSensor| Min: %min| Max: %max"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    
    //% weight=99
    export function SetSensorValue(sensor: SensorNumber,min:number,max:number): void {
        MinValueSensors[sensor] = min
        MaxValueSensors[sensor] = max
        AvgValueSensors[sensor] = max-min
    }


}
