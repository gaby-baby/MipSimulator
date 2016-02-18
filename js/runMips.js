
/* State of the process mainly stored in the stage buffers and Program counter
* There are 4 buffer IF/ID,ID/EX,EX/MEM,MEM/WB. 
*        IF/ID                           ID/EX
*       |0  |1       |2                 |3         |4          |5         |6      |7        |8        |9          |10       |11       |
*       |PC |PC_4_IF |32bit_instruction |WB_control|MEM_control|EX_control|PC_4_ID|read_Reg1|read Reg2|32_sign_ext|inst20_16|inst15_11|
        |dec|dec     |32bit binary      |array[2]  |array[3]   |array[4]  |dec    |32bit    |32bit    |32bit      |5bit     |5bit     |

        EX/MEM                                                               MEM/WB
*       |12        |13         |14        |15  |16        |17       |18      |19        |20         |21        |
*       |WB_control|MEM_control|branchAddr|zero|ALU_result|read_Reg2|Reg_Dest|WB_control|Memory_read|ALU_result|
*       |array[2]  |array[3]   |32bit     |bool|32bit     |32bit    |32bit   |array[2]  |32bit      |32bit     |




*       |EX_control                  |MEM_control              |WB_control        |
        |0      |1     |2     |3     |0     |1       |2        |0        |1
*       |reg_dst|ALUop1|ALUop0|ALUsrc|branch|mem_read|mem_write|reg_write|memtoreg|
*/
var step = function (pastState) {
    var newState = [];
    
    if (pastState[15] && pastState[13][0])
        newState[0] = pastState[14];
    else {
        newState[0] = pastState[0] + 4;
    }

    newState[1] = pastState[0] + 4;

    newState[2] = readInstMem(pastState[0]);
    //TODO edit colorStack

    newState[3] = controlUnit(pastState[2])[2];
    newState[4] = controlUnit(pastState[2])[1];
    newState[5] = controlUnit(pastState[2])[0];

    
    newState[6] = pastState[1];
    var readReg = registerControl(pastState[2].slice(21, 26),pastState[2].slice(16, 21));
    newState[7] = readReg[0];
    newState[8] = readReg[1];
    newState[9] = pastState[2].slice(0, 15).pad('0', 31).concat(pastState[2].slice(15, 16));
    newState[10] = pastState[2].slice(16, 21);
    newState[11] = pastState[2].slice(11, 16);

    newState[12] = pastState[3];
    newState[13] = pastState[4];
    newState[14] = toBinary(toDecimal(pastState[9]) * 4 + toDecimal(pastState[6]));
    var mux_alu = (pastState[5][3]) ? pastState[9] : pastState[8];
    newState[16] = ALU_unit(pastState[9].slice(0, 6), pastState[5][2], pastState[5][1], pastState[7], mux_alu);
    newState[15] = newState[16] === "00000000000000000000000000000000"
    
    newState[17] = pastState[8];
    newState[18] = (pastState[5][0])?pastState[11]:pastState[10]
    newState[19] = pastState[12];
    newState[20] = MemoryUnit(pastState[13][1],pastState[13][2]);
    newState[21] = pastState[16];

    return newState;
}

var controlUnit = function (instrbuffer) {
    // simulate control unit
    // here we cheat a little by using if instead of pure binary logic
    // return [EX,MEM,WB]
    var controlReturn=[];
    controlReturn[0]=new Array(4);
    controlReturn[1]=new Array(3);
    controlReturn[2]=new Array(2);
    // r type
    if ((instrbuffer.slice(0, 6) === "100010" || instrbuffer.slice(0, 6) === "100000") && instrbuffer.slice(26, 32) === "000000") {
        controlReturn[0][0] = 1; controlReturn[0][1] = 1; controlReturn[0][2] = 0; controlReturn[0][3] = 0;
        controlReturn[1][0] = 0; controlReturn[1][1] = 0; controlReturn[1][2] = 0;
        controlReturn[2][0] = 1; controlReturn[2][1] = 0;
    }// i type
    else if (instrbuffer.slice(26, 32) === "100011") {//lw
        controlReturn[0][0] = 0; controlReturn[0][1] = 0; controlReturn[0][2] = 0; controlReturn[0][3] = 1;
        controlReturn[1][0] = 0; controlReturn[1][1] = 1; controlReturn[1][2] = 0;
        controlReturn[2][0] = 1; controlReturn[2][1] = 1;
    } else if (instrbuffer.slice(26, 32) === "101011") {//sw
        controlReturn[0][0] = 0; controlReturn[0][1] = 0; controlReturn[0][2] = 0; controlReturn[0][3] = 1;
        controlReturn[1][0] = 0; controlReturn[1][1] = 0; controlReturn[1][2] = 1;
        controlReturn[2][0] = 0; controlReturn[2][1] = 0;
    }
    else if (instrbuffer.slice(26, 32) === "000010") {//beq
        controlReturn[0][0] = 0; controlReturn[0][1] = 0; controlReturn[0][2] = 1; controlReturn[0][3] = 0;
        controlReturn[1][0] = 1; controlReturn[1][1] = 0; controlReturn[1][2] = 0;
        controlReturn[2][0] = 0; controlReturn[2][1] = 0;
    }else{
        controlReturn[0][0] = 0; controlReturn[0][1] = 0; controlReturn[0][2] = 0; controlReturn[0][3] = 0;
        controlReturn[1][0] = 0; controlReturn[1][1] = 0; controlReturn[1][2] = 0;
        controlReturn[2][0] = 0; controlReturn[2][1] = 0;
    }
    return controlReturn;
}


var MemoryUnit = function (memRead, memWrite, readAddr, writeAddr, writeData) {
    if (memRead)
        return "10101010101010101010101010101010";
    else
        return "00000000000000000000000000000000";
}

var registerControl = function (address1, address2, regWrite, writeReg, writeData) {
    //input parameters: register ref,register ref,write control,write register ref, write data
    var regbuffer = [];
    if(toDecimal(address1) % 2){
        regbuffer.push(registers[parseInt(toDecimal(address1) / 2)].value2);
    }else{
        regbuffer.push(registers[parseInt(toDecimal(address1) / 2)].value1);
    }
    if (toDecimal(address2) % 2) {
        regbuffer.push(registers[parseInt(toDecimal(address2) / 2)].value2);
    } else {
        regbuffer.push(registers[parseInt(toDecimal(address2) / 2)].value1);
    }
   // $("#register_display"). update reg dis
    return regbuffer;

}
// ALU_unit is an amagamation of ALU,ALU control unit
var ALU_unit = function (funct,ALUop0, ALUop1, read1, mux_alu) {
    var alu_result;
    
    if (ALUop0===0 && ALUop1===0) {
        AlU_store.value = "010";
        AlU_store.intent = "Add for LW or SW";
        alu_result = (toDecimal(mux_alu) + toDecimal(read1));

    } else {
        if (ALUop0===1) {
            AlU_store.value = "110";
            AlU_store.intent = "Subtract for Branch";
            alu_result = (toDecimal(read1) - toDecimal(mux_alu));
        } else if (ALUop1===1) {
            if (funct === "100000") {
                console.log(ALUop0, ALUop1);
                AlU_store.value = "010";
                AlU_store.intent = "Add for Add instruction";
                alu_result = (toDecimal(mux_alu) + toDecimal(read1));
            }
            else if (funct === "100010") {
                AlU_store.value = "010";
                AlU_store.intent = "Subtract for Sub instruction";
                alu_result = (toDecimal(read1) - toDecimal(mux_alu));
            }
        }
    }
    
    return toBinary(alu_result);
}

//   |dec|dec     |32bit binary      |array[2]  |array[3]   |array[4]  |dec    |32bit    |32bit    |32bit      |5bit     |5bit     |
//|array[2]  |array[3]   |32bit     |bool|32bit     |32bit    |32bit   |array[2]  |32bit      |32bit     |

var zeroizeState = function (){
    var emptystate=[];
    emptystate[0] = 0;emptystate[1] = 0;
    emptystate[2] = "00000000000000000000000000000000";
    emptystate[3] = [0, 0];
    emptystate[4] = [0, 0, 0];
    emptystate[5] = [0, 0, 0, 0];
    emptystate[6] = 0;
    emptystate[7] = "00000000000000000000000000000000";
    emptystate[8] = "00000000000000000000000000000000";
    emptystate[9] = "00000000000000000000000000000000";
    emptystate[10] = "00000";
    emptystate[11] = "00000";
    emptystate[12] = [0, 0];
    emptystate[13] = [0, 0, 0];
    emptystate[14] = "00000000000000000000000000000000";
    emptystate[15] = true;
    emptystate[16] = "00000000000000000000000000000000";
    emptystate[17] = "00000000000000000000000000000000";
    emptystate[18] = "00000000000000000000000000000000";
    emptystate[19] = [0, 0];
    emptystate[20] = "00000000000000000000000000000000";
    emptystate[21] = "00000000000000000000000000000000";
    return emptystate;
}

function readInstMem(PC) {
    var instructionString;
    var strarray = (InstructionMemory[PC / 4]);
    if(strarray){
    if(strarray[0].match(/^add$/)){
        instructionString = (toBinary(32).pad('0', 6)).concat("00000")
            .concat(toBinary(strarray[1]).pad('0', 5))
            .concat(toBinary(strarray[3]).pad('0', 5))
            .concat(toBinary(strarray[2]).pad('0', 5)).concat("000000");
    } else if(strarray[0].match(/^sub$/)){
        instructionString = toBinary(34).pad('0', 6).concat("00000")
            .concat(toBinary(strarray[1]).pad('0', 5))
            .concat(toBinary(strarray[3]).pad('0', 5))
            .concat(toBinary(strarray[2]).pad('0', 5)).concat("000000");
    } else if (strarray[0].match(/^lw$/)) {
        instructionString = toBinary(strarray[3]).pad('0', 16)
            .concat(toBinary(strarray[1]).pad('0', 5))
            .concat(toBinary(strarray[2]).pad('0', 5))
            .concat(toBinary(35).pad('0', 6));
    } else if (strarray[0].match(/^sw$/)) {
        instructionString = toBinary(strarray[3]).pad('0', 16)
                .concat(toBinary(strarray[1]).pad('0', 5))
                .concat(toBinary(strarray[2]).pad('0', 5))
                .concat(toBinary(43).pad('0', 6));
    } else if (strarray[0].match(/^beq$/)) {
        instructionString = toBinary(strarray[3]).pad('0', 16)
                .concat(toBinary(strarray[2]).pad('0', 5))
                .concat(toBinary(strarray[1]).pad('0', 5))
                .concat(toBinary(4).pad('0', 6));
    } else {
        return alert("Invaild Addressing Check Branch Does not Go Out of Bounds");
    }
    }else{
        instructionString="00000000000000000000000000000000";
    }
    return instructionString;

}
String.prototype.pad = function (_char, len, to) {
    if (!this || !_char || this.length >= len) {
        return this;
    }
    to = to || 0;

    var ret = this;

    var max = (len - this.length) / _char.length + 1;
    while (--max) {
        ret = (to) ? ret + _char : _char + ret;
    }

    return ret;
};

var toBinary = function (decNum) {
    return parseInt(decNum, 10).toString(2);
}

var toDecimal = function (binary) {
    return parseInt(binary, 2).toString(10);
}

function parseInst(str) {
    var res = {};
    var set=[];
    str.split("\n").forEach(function (elem, index, array) {
        set.push(elem.toLowerCase().trim().slice(1, -1).split(/><|>\s</));
        if (!set[index][0].match(/^add$|^sub$|^lw$|^sw$|^beq$/)){
            res["fail"] = true;
            res["error"] = "Unsupported Operator, Please Enter One of the Following:add,sub,lw,sw,beq";
        }else{
            //check reg ref and/or offset
            for (i=1;i<4;i++){
                if(set[index][i]!= parseInt(set[index][i], 10)){ //check for interger
                    res["fail"] = true;
                    res["error"] = "One or More Registers References not Intergers or Does Not Exist";
                } else if(set[index][i] < 0 || set[index][i] > 32){ 
                    if(set[index][0].match(/^lw$|^sw$|^beq$/)) {
                        if(set[index][3]>65535){
                        res["fail"] = true;
                        res["error"] = "Offset Overflow";
                        }
                    } else{
                        res["fail"] = true;
                        res["error"] = "Outside Available registers";
                    }
                }
            }
        }
    });
    if (!res.fail) {
        res["fail"] = false;
        res["set"] = set;
    }
    return res;
    
}