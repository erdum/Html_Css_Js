let cpu = {
    
  // 16 nible volatile RAM
  ram: [
    // Status register
  // I  C  Z  R/w
    [0, 0, 0, 0],// 0x0
    // Program counter
    [0, 0, 0, 0],// 0x1
    // Stack pointer
    [1, 1, 1, 1],// 0x2
    // General purpose registers
    // r0
    [0, 0, 0, 0],// 0x3
    // r1
    [0, 0, 0, 0],// 0x4
    // 11 nible volatile memory
    [0, 0, 0, 0],// 0x5
    [0, 0, 0, 0],// 0x6
    [0, 0, 0, 0],// 0x7
    [0, 0, 0, 0],// 0x8
    [0, 0, 0, 0],// 0x9
    [0, 0, 0, 0],// 0xA
    [0, 0, 0, 0],// 0xB
    [0, 0, 0, 0],// 0xC
    [0, 0, 0, 0],// 0xD
    [0, 0, 0, 0],// 0xE
    [0, 0, 0, 0],// 0xF
    ],
  
  // Program counter getter
  pcGet: () => {
    return cpu.ram[1];
  },
  
  // Program counter setter
  pcSet: (value) => {
    cpu.ram[1] = value;
  },
  
  // Stack pointer getter
  spGet: () => {
    return cpu.ram[2];
  },
  
  // Stack pointer setter
  pcSet: (value) => {
    cpu.ram[2] = value;
  },
    
  // RAM getter
  ramGet: (address) => {
    return cpu.ram[cpu.binToDec(address)];
  },
  
  // RAM setter
  ramSet: (address, value) => {
    cpu.ram[cpu.binToDec(address)] = value;
  },
  
  // 16 nible ROM/Flash
  rom: [],
  
  // Rom getter
  romGet: (address) => {
    return cpu.rom[cpu.binToDec(address)];
  },
  
  // Rom Initializer
  romInit: () => {
    for(n = 0; n < 16; n++){
      if(cpu.rom[n] == undefined){
        cpu.rom[n] = [0, 0, 0, 0];
      }
    }
  },
  
  // ldi
  // MSB address{0000} gpr{0} value{000}
  ldi: (operands) => {
    if(operands[0] == 0){
      cpu.ram[3] = [0, operands[1], operands[2], operands[3]];
    }
    else{
      cpu.ram[4] = [0, operands[1], operands[2], operands[3]];
    }
  },
  
  // Instruction table
  instructionTable: (opcode, operands) => {
    opcode = cpu.binToDec(opcode);
    switch (opcode){
      case 0:
        break;
      case 1:
        cpu.ldi(operands);
        break;
    }
  },
  
  // Instruction register
  ireg0: [0, 0, 0, 0],
  ireg1: [0, 0, 0, 0],

  // Binary to decimal converter
  binToDec: (bVal) => {
    let ans = [];
    let ansD = 0;
    let val = 1;
    for(n = 3; n >= 0; n--){
        if(bVal[n] == 1){
            ans[n] = val;
        }
        else{
            ans[n] = 0;
        }
        val += val;
    }
    for(n = 0; n < 4; n++){
        ansD += ans[n];
    }
    return ansD;
  },

  // Decimal to binary converter
  decToBin: (dVal) => {
    let lVal = dVal;
    let reminder = [];
    if(dVal <= 15){
        for(n = 3; n >= 0; n--){
            if(lVal >= 1){
                reminder[n] = Math.floor(lVal % 2);
                lVal = lVal / 2;
            }
            else{
                reminder[n] = 0;
            }
        }
    }
    return reminder;
  },

  // Binary to hexadecimal converter
  binToHex: (bin) => {
    let table = ['A', 'B', 'C', 'D', 'E', 'F'];
    let dec = cpu.binToDec(bin);
    if(dec > 9){
        switch (dec){
            case 10:
                return table[0];
                break;
            case 11:
                return table[1];
                break;
            case 12:
                return table[2];
                break;
            case 13:
                return table[3];
                break;
            case 14:
                return table[4];
                break;
            case 15:
                return table[5];
                break;
            default:
                return table[6];
                break;
        }
    }
    else{
        return dec;
    }
  },

  // Hexadecimal to binary converter
  hexToBin: (hex) => {
    if(typeof(hex) == 'string'){
        switch (hex){
            case 'A':
                return cpu.decToBin(10);
                break;
            case 'B':
                return cpu.decToBin(11);
                break;
            case 'C':
                return cpu.decToBin(12);
                break;
            case 'D':
                return cpu.decToBin(13);
                break;
            case 'E':
                return cpu.decToBin(14);
                break;
            default:
                return cpu.decToBin(15);
                break;
        }
    }
    else{
        return cpu.decToBin(hex);
    }
  },
  
  // Program counter incrementer
  pcInc: (offset=1) => {
    cpu.ram[1] = cpu.decToBin(cpu.binToDec(cpu.ram[1]) + offset);
  },
  
  // Main CPU execution
  run: () => {
      cpu.romInit();
    // Execute on whole rom 
    while(cpu.binToDec(cpu.pcGet()) <= 15){
      // CPU fetch 2 nible or single instruction of one byte
      cpu.ireg0 = cpu.romGet(cpu.pcGet());
      cpu.pcInc();
      cpu.ireg1 = cpu.romGet(cpu.pcGet());
      cpu.pcInc();
      // Program counter updated to offset 2 for fetching next instruction
    
      // Decoding instruction in ireg0
      cpu.instructionTable(cpu.ireg0, cpu.ireg1);
    }
  }
}

cpu.rom[0] = [0, 0, 0, 0];
cpu.rom[1] = [0, 1, 1, 1];
cpu.run();
console.log(cpu.ram[3]);