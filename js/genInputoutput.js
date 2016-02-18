var geninputoutput = function (name) {
 /*     |0  |1       |2                 |3         |4          |5         |6      |7        |8        |9          |10       |11       |
*       |PC |PC_4_IF |32bit_instruction |WB_control|MEM_control|EX_control|PC_4_ID|read_Reg1|read Reg2|32_sign_ext|inst20_16|inst15_11|
        |dec|dec     |32bit binary      |array[2]  |array[3]   |array[4]  |dec    |32bit    |32bit    |32bit      |5bit     |5bit     |

        EX/MEM                                                               MEM/WB
*       |12        |13         |14        |15  |16        |17       |18      |19        |20         |21        |
*       |WB_control|MEM_control|branchAddr|zero|ALU_result|read_Reg2|Reg_Dest|WB_control|Memory_read|ALU_result|
*       |array[2]  |array[3]   |32bit     |bool|32bit     |32bit    |32bit   |array[2]  |32bit      |32bit     |
*
*       |EX_control                  |MEM_control              |WB_control        |
        |0      |1     |2     |3     |0     |1       |2        |0        |1
*       |reg_dst|ALUop1|ALUop0|ALUsrc|branch|mem_read|mem_write|reg_write|memtoreg|
*/
    var inputoutput;
    if (name === "instr") {
        inputoutput = "buffer value: " + state[2]; 
    } else if (name === "program_counter_incre") {
        inputoutput = "buffer value: " + state[1];
    } else if (name === "program_counter") {
        inputoutput = "Current value: " + state[0];
    } else if (name === "instr_mem") {
        inputoutput = "Instruction Memory holds program in memory.\n Program lines are retrieve use address \nsee below"
    } else if (name === "program_counter_adder") {
        inputoutput = "current output: " + state[1];
    } else if (name === "regs_wb") {
        inputoutput = "Registers write";
    } else if (name === "sign_ext") {
        inputoutput = "Sign extenstion of instruction's lower 16 bit \n presevering sign: "+state[9];
    } else if (name === "controller") {
        inputoutput = "logic circuit determines control signals from given instruction"; 
    } else if (name === "write_back_ex") {
        inputoutput = "reg_write: "+state[3][1]+"\n"+"memtoreg: "+state[3][1];
    } else if (name === "mem_exe") {
        inputoutput = "branch :"+state[4][0]+"\n"+"mem_read :"+state[4][1]+"\n"+"mem_write :"+state[4][2];
    } else if (name === "exe_exe") {
        inputoutput = "reg_dst :"+state[5][0]+"\n"+"ALUop1 :"+state[5][1]+"\n"+"ALUop0 :"+state[5][2]+"\n"+"ALUsrc :"+state[5][3];
    } else if (name === "reg_1") {
        inputoutput = "buffer value: " + state[7];
    } else if (name === "reg_2") {
        inputoutput = "buffer value: " + state[8];
    } else if (name === "inst_20_16") {
        inputoutput = "buffer value: " + state[10];
    } else if (name === "inst_15_11") {
        inputoutput = "buffer value: " + state[11];
    } else if (name === "program_counter_incre_exe") {
        inputoutput = "buffer value: " + state[6];
    } else if (name === "write_back_mem") {
        inputoutput = "reg_write: " + state[12][1] + "\n" + "memtoreg: " + state[12][1];
    } else if (name === "mem_mem") {
        inputoutput = "branch :" + state[13][0] + "\n" + "mem_read :" + state[13][1] + "\n" + "mem_write :" + state[13][2];
    } else if (name === "branch_addr") {
        inputoutput = "adds PC+4 with offset*4";
    } else if (name === "alu_result") {
        inputoutput = "main arithmetic logic unit";
    } else if (name === "reg_2_mem") {
        inputoutput = "buffer value: " + state[17];
    } else if (name === "reg_dest") {
        inputoutput = "buffer value: " + state[18];
    } else if (name === "alu_contr") {
        inputoutput = "logic unit controls main ALU |value: " + AlU_store.value + " |intention: " + AlU_store.intent;
    } else if (name === "reg_2_mem") {
        inputoutput = "buffer value: " + state[17];
    } else if (name === "reg_2_mem") {
        inputoutput = "buffer value: " + state[17];
    } else if (name === "reg_2_mem") {
        inputoutput = "buffer value: " + state[17];
    } else if (name === "reg_2_mem") {
        inputoutput = "buffer value: " + state[17];
    }


    return inputoutput;
}