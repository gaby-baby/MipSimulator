var gentooltip = function (name){
/*   gentootltip  ********
*    Describition : Generate tool tip string using name as component identifier  
*   
*   
*       Buffer Values as Stored in single array 
*   
*       |0  |1       |2                 |3         |4          |5         |6      |7        |8        |9          |10       |11       |
*       |PC |PC_4_IF |32bit_instruction |WB_control|MEM_control|EX_control|PC_4_ID|read_Reg1|read Reg2|32_sign_ext|inst20_16|inst15_11|
        |dec|dec     |32bit binary      |array[2]  |array[3]   |array[4]  |dec    |32bit    |32bit    |32bit      |5bit     |5bit     |

        EX/MEM                                                               MEM/WB
*       |12        |13         |14        |15  |16        |17       |18      |19        |20         |21        |22
*       |WB_control|MEM_control|branchAddr|zero|ALU_result|read_Reg2|Reg_Dest|WB_control|Memory_read|ALU_result|
*       |array[2]  |array[3]   |32bit     |bool|32bit     |32bit    |32bit   |array[2]  |32bit      |32bit     |
*
*       |EX_control                  |MEM_control              |WB_control        |
        |0      |1     |2     |3     |0     |1       |2        |0        |1
*       |reg_dst|ALUop1|ALUop0|ALUsrc|branch|mem_read|mem_write|reg_write|memtoreg|
*/
    var inputoutput;
    switch (name){
        case "instr": 
            inputoutput = "buffer value: " + state[2];
            break;
        case "program_counter_incre":
            inputoutput = "buffer value: " + state[1];
            break;
        case "program_counter":
            inputoutput = (state[0] - 4 < 0) ? "Current Instruction: " + 0 : "Current Instruction: " + (state[0] - 4).toString();
            break;
        case "instr_mem":
            inputoutput = "Instruction Memory holds program in memory.\n Program lines are retrieve use address \nsee below";
            break;
        case "program_counter_adder":
            inputoutput = "current output: " + state[1];
            break;
        case "regs_wb":
            inputoutput = "Registers write";
            break;
        case "sign_ext":
            inputoutput = "Sign extenstion of instruction's lower 16 bit \n presevering sign: "+state[9];
            break;
        case "controller":
            inputoutput = "logic circuit determines control signals from given instruction";
            break;
        case "write_back_ex":
            inputoutput = "reg_write: "+state[3][0]+", memtoreg: "+state[3][1];
            break;
        case "mem_exe":
            inputoutput = "branch: "+state[4][0]+", mem_read: "+state[4][1] +", mem_write: "+state[4][2];
            break;
        case "exe_exe":
            inputoutput = "reg_dst: " + state[5][0] + ", ALUop1: " + state[5][1] + ", ALUop0: " + state[5][2] + ", ALUsrc: " + state[5][3];
            break;
        case "reg_1":
            inputoutput = "buffer value: " + state[7];
            break;
        case "reg_2":
            inputoutput = "buffer value: " + state[8];
            break;
        case "inst_20_16":
            inputoutput = "buffer value: " + state[10];
            break;
        case "inst_15_11":
            inputoutput = "buffer value: " + state[11];
            break;
        case "program_counter_incre_exe":
            inputoutput = "buffer value: " + state[6];
            break;
        case "write_back_mem":
            inputoutput = "reg_write: " + state[12][0] + ", " + "memtoreg: " + state[12][1];
            break;
        case "mem_mem":
            inputoutput = "branch :" + state[13][0] + ", " + "mem_read :" + state[13][1] + ", " + "mem_write :" + state[13][2];
            break;
        case "branch_addr":
            inputoutput = "output value: " + state[14];
            break;
        case "zero":
            inputoutput = (state[15])?"True":"False";
            break;
        case "alu_result":
            inputoutput = "buffer value: " + state[16];
            break;
        case "reg_2_mem":
            inputoutput = "buffer value: " + state[17];
            break;
        case "reg_dest":
            inputoutput = "buffer value: " + state[18];
            break;
        case "alu_contr":
            inputoutput = "value: " + AlU_store.value + " | intention: " + AlU_store.intent;
            break;
        case "reg_dest_0":
            inputoutput = "Register destination for R-Type";
            break;
        case "reg_dest_1":
            inputoutput = "Register destination for I-Type";
            break;
        case "alu_mux_0":
            inputoutput = "Selects Value of Register 2 for R-Type";
            break;
        case "alu_mux_1":
            inputoutput = "Selects Immediate Value for I-Type";
            break;
        case "alu":
            inputoutput = "ALU produces two outputs(zero, result), who's functionality is control by ALU Control";
            break;
        case "alu_address":
            inputoutput = "adds PC+4 with offset*4";
            break;
        case "left_shift":
            inputoutput = "Multiple value by 4";
            break;
        case "branch_and":
            inputoutput = "Ensure Branch Conditions";
            break;
        case "data_memory":
            break;
        case "write_back_wb":
            inputoutput = "reg_write: " + state[19][0] + ", " + "memtoreg: " + state[19][1];
            break;
        case "read_data":
            inputoutput = "buffer value: " + state[20];
            break;
        case "alu_result_wb":
            inputoutput = "buffer value: " + state[21];
            break;
        case "reg_dest_wb":
            inputoutput = "buffer value: " + state[22];
            break;
        case "regs_de":
            inputoutput = "buffer value: " + state[17];
            break;
        case "mem_mux_0":
            inputoutput = "buffer value: " + state[17];
            break;
        case "mem_mux_1":
            inputoutput = "buffer value: " + state[17];
            break;


            
    }


    return inputoutput;
}