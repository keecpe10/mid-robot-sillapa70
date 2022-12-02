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
    //% block=" 0-5"
    FRONT,
    //% block=" 6-7"
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

/**
  * Enumeration of Servo.
  */
enum ibitServo {
    //% block="1"
    SV1,
    //% block="2"
    SV2
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
    function set_motors(right_speed: number, left_speed: number): void {

        //let l_speed = pins.map(left_speed, 0, 100, 0, 1023)
        //let r_speed = pins.map(right_speed, 0, 100, 0, 1023)
        //Forward
        if (right_speed >= 0 && left_speed >= 0) {
            let l_speed = pins.map(left_speed, 0, 100, 0, 1023)
            let r_speed = pins.map(right_speed, 0, 100, 0, 1023)
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P14, l_speed)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.analogWritePin(AnalogPin.P16, r_speed)
        }
        if (right_speed >= 0 && left_speed < 0) {
            let l_speed = pins.map(-left_speed, 0, 100, 0, 1023)
            let r_speed = pins.map(right_speed, 0, 100, 0, 1023)
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.analogWritePin(AnalogPin.P14, l_speed)
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.analogWritePin(AnalogPin.P16, r_speed)
        }
        if (right_speed < 0 && left_speed >= 0) {
            let l_speed = pins.map(left_speed, 0, 100, 0, 1023)
            let r_speed = pins.map(-right_speed, 0, 100, 0, 1023)
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.analogWritePin(AnalogPin.P14, l_speed)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P16, r_speed)
        }

        if (right_speed < 0 && left_speed < 0) {
            let l_speed = pins.map(-left_speed, 0, 100, 0, 1023)
            let r_speed = pins.map(-right_speed, 0, 100, 0, 1023)
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.analogWritePin(AnalogPin.P14, l_speed)
            pins.digitalWritePin(DigitalPin.P15, 1)
            pins.analogWritePin(AnalogPin.P16, r_speed)
        }
    }

    function motors_puase(time:number):void{
        let previousMillis = input.runningTime()
        while (input.runningTime() - previousMillis < time) {
            set_motors(0, 0)
        }
    }

    function set_motors_times(time: number,speed:number): void {
        let previousMillis = input.runningTime()
        while (input.runningTime() - previousMillis < time) {
            set_motors(speed, speed)
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
    /**เริ่มทำงาน
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_initStart block="เริ่มการทำงาน"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% weight=100
    export function initStart(): void {
        Servo(1, 0);
        Servo(2, 0);
    }

    /**อ่านค่าเซ็นเซอร์
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_ReadSensorPanel block="แสดงค่าเซ็นเซอร์ %panel"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% inlineInputMode=inline
    //% weight=99
    export function ReadSensorPanel(panel: SensorPanel): void {
        if (panel == SensorPanel.FRONT) {
            serial.writeLine("" + ReadADC(Sensors[0])
                +" : " + ReadADC(Sensors[1])
                + " : " + ReadADC(Sensors[2])
                + " : " + ReadADC(Sensors[3])
                + " : " + ReadADC(Sensors[4])
                + " : " + ReadADC(Sensors[5]))
        }
        if (panel == SensorPanel.BLACK) {
            serial.writeLine("" + ReadADC(Sensors[6])
                + " : " + ReadADC(Sensors[7]))
        }

        pause(100);
    }

    /**กำหนดค่าเซ็นเซอร์
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_SetSensorValue block="กำหนดค่าเซ็นเซอร์ %numSensor| Min: %min| Max: %max"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    
    //% weight=98
    export function SetSensorValue(sensor: SensorNumber,min:number,max:number): void {
        MinValueSensors[sensor] = min
        MaxValueSensors[sensor] = max
        AvgValueSensors[sensor] = (max+min)/2
    }

    function FwLine(speed: number): void {
        //ไปข้างหน้าจนกระทั่งเซ็นเซอร์ด้านหน้าตัวใดตัวหนึ่งเจอเส้นสีดำ
        while (ReadADC(Sensors[1]) < AvgValueSensors[1] && ReadADC(Sensors[2]) < AvgValueSensors[2]) {
            if (ReadADC(Sensors[0]) > AvgValueSensors[0]) {
                set_motors(speed, speed - 20);
            } else if (ReadADC(Sensors[3]) > AvgValueSensors[3]) {
                set_motors(speed - 20, speed);
            } else {
                set_motors(speed, speed);
            }
        }
        motors_puase(100);
        //ปรับให้เซ็นเซอร์ 2 ตัวข้างหน้าอยู่ที่เส้น

        while (ReadADC(Sensors[1]) > AvgValueSensors[1] && ReadADC(Sensors[2]) < AvgValueSensors[2]) {
            set_motors(0, speed);
        }

        while (ReadADC(Sensors[1]) < AvgValueSensors[1] && ReadADC(Sensors[2]) > AvgValueSensors[2]) {
            set_motors(speed, 0);
        }
        //หยุดมอเตอร์ 100ms
        motors_puase(100);

    }
    function Fw(speed: number): void {
        if (ReadADC(Sensors[0]) > AvgValueSensors[0]) {
            set_motors(speed, speed - 20);
            //set_motors(speed-20, speed);
        } else if (ReadADC(Sensors[3]) > AvgValueSensors[3]) {
            set_motors(speed - 20, speed);
            //set_motors(speed , speed- 20);
        } else {
            set_motors(speed, speed);
        }
    }
    /**หมุนเช็คเส้นด้านหลัง
         * @param speed percent of maximum speed, eg: 50
          * @param time percent of maximum time, eg: 500
          */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_spinCheckLine block="หมุน %direction| ความเร็ว %speed|เวลา %time ms แล้วเช็คเส้นด้านหลัง"
    //% speed.min=0 speed.max=100
    //% time.min=0
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% inlineInputMode=inline
    //% weight=96
    export function spinCheckLine(direction: DirectionSpin, speed: number, time: number):void{
        spin(direction, speed, time);
        while (ReadADC(Sensors[4]) < AvgValueSensors[4] && ReadADC(Sensors[5]) < AvgValueSensors[5]) {
            set_motors(-speed, -speed);
        }
        motors_puase(100);
        //ปรับให้เซ็นเซอร์ 2 ตัวข้างหน้าอยู่ที่เส้น

        while (ReadADC(Sensors[4]) > AvgValueSensors[4] && ReadADC(Sensors[5]) < AvgValueSensors[5]) {
            set_motors(0, -speed);
        }

        while (ReadADC(Sensors[4]) < AvgValueSensors[4] && ReadADC(Sensors[5]) > AvgValueSensors[5]) {
            set_motors(-speed, 0);
        }
        //หยุดมอเตอร์ 100ms
        motors_puase(100);

    }

    function Servo(Servo: ibitServo, Degree: number): void {
        if (Servo == ibitServo.SV1) {
            pins.servoWritePin(AnalogPin.P8, Degree)
        }
        if (Servo == ibitServo.SV2) {
            pins.servoWritePin(AnalogPin.P12, Degree)
        }
    }

    /**ปล่อยลูกบาศก์
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_LetCube block="ปล่อยลูกบาศก์ %servo"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% weight=90
    export function LetCube(servo:ibitServo): void {
        Servo(servo, 90);
        pause(300);
        Servo(servo, 0);
        pause(100);
    }

    /**ไปข้างหน้าจับเวลา
     * @param speed percent of maximum speed, eg: 50
      * @param time percent of maximum time, eg: 500
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_FwTime block="ไปข้างหน้าความเร็ว %speed| เวลา %time ms"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% speed.min=0 speed.max=100
    //% time.min=0
    //% weight=96
    export function FwTime(speed: number, time: number): void {
        let previousMillis = input.runningTime()
        while (input.runningTime() - previousMillis < time) {
            Fw(speed);
        }
    }

    /**ไปข้างหน้าจับเวลา
     * @param speed percent of maximum speed, eg: 50
      * @param time percent of maximum time, eg: 500
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_FwTime block="ถอยหลังความเร็ว %speed| เวลา %time ms"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% speed.min=0 speed.max=100
    //% time.min=0
    //% weight=96
    export function BwTime(speed: number, time: number): void {
        let previousMillis = input.runningTime()
        while (input.runningTime() - previousMillis < time) {
            set_motors(-speed, -speed);
        }
    }

    /**ไปข้างหน้าจนเจอเส้นดำแล้วปรับเซ็นเซอร์ด้านหน้าให้เจอเส้นดำทั้งคู่
     * @param speed percent of maximum speed, eg: 50
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_FwBlackLine block="ไปข้างหน้าความเร็ว %speed"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% speed.min=0 speed.max=100
    //% weight=96
    function FwBlackLine(speed: number): void {
        FwLine(speed);
        set_motors_times(200, -50);
        motors_puase(100);
        FwLine(speed);
        set_motors_times(100, -50);
    }

    /**ไปข้างหน้าจนเจอเส้นดำ
     * @param speed percent of maximum speed, eg: 50
     *  @param respeed percent of maximum respeed, eg: 25
      * @param time percent of maximum time, eg: 500
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_FwBlackTime block="ไปข้างหน้าความเร็ว %speed| เวลา %time ms| ลดความเร็ว %respeed จนเจอเส้นดำ"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% speed.min=0 speed.max=100
    //% respeed.min=0 respeed.max=100
    //% time.min=0
    //% weight=96
    export function FwBlackTime(speed:number, time:number, respeed:number): void {
        let previousMillis = input.runningTime()
        while (input.runningTime() - previousMillis < time) {
            Fw(speed);
        }
        FwBlackLine(respeed);
    }

    /**จบการทำงาน
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_Stops block="จบการทำงาน"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% weight=50
    export function Stops(): void {
        while(1){
            set_motors(0,0);
        }
    }

    /**Test Function
      */
    //% help=math/map weight=10 blockGap=8
    //% blockId=MidRobot_Test block="Test"
    //% subcategory=ระดับกลาง
    //% group="ระดับกลาง"
    //% weight=50
    export function Test(): void {
       // set_motors(100, 100);
        /*serial.writeLine("" + ReadADC(Sensors[0])
            + " : " + ReadADC(Sensors[1])
            + " : " + ReadADC(Sensors[2])
            + " : " + ReadADC(Sensors[3])
            + " : " + ReadADC(Sensors[4]))

        serial.writeLine("" + AvgValueSensors[0]
            + " : " + AvgValueSensors[1]
        + " : " + AvgValueSensors[2]
            + " : " + AvgValueSensors[3]
            + " : " + AvgValueSensors[4]
            + " : " + AvgValueSensors[5])*/

        /*while (ReadADC(Sensors[4]) < AvgValueSensors[4] && ReadADC(Sensors[5]) < AvgValueSensors[5]) {
            set_motors(-60, -60);
        }
        motors_puase(100);
        //ปรับให้เซ็นเซอร์ 2 ตัวข้างหน้าอยู่ที่เส้น

        while (ReadADC(Sensors[4]) > AvgValueSensors[4] && ReadADC(Sensors[5]) < AvgValueSensors[5]) {
            set_motors(0, -60);
        }

        while (ReadADC(Sensors[4]) < AvgValueSensors[4] && ReadADC(Sensors[5]) > AvgValueSensors[5]) {
            set_motors(-60, 0);
        }
        //หยุดมอเตอร์ 100ms
        motors_puase(100);*/
        let speed = 60;
        while (ReadADC(Sensors[1]) < AvgValueSensors[1] && ReadADC(Sensors[2]) < AvgValueSensors[2]) {
            
                set_motors(speed, speed);
            
        }
        motors_puase(100);
        //ปรับให้เซ็นเซอร์ 2 ตัวข้างหน้าอยู่ที่เส้น

        while (ReadADC(Sensors[0]) > AvgValueSensors[0] && ReadADC(Sensors[3]) < AvgValueSensors[3]) {
            set_motors(0, speed);
        }

        while (ReadADC(Sensors[0]) < AvgValueSensors[0] && ReadADC(Sensors[3]) > AvgValueSensors[3]) {
            set_motors(speed, 0);
        }
        //หยุดมอเตอร์ 100ms
        motors_puase(100);

    }
}
