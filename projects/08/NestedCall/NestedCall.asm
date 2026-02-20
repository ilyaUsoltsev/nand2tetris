// bootstrap
@256
D=A
@SP
M=D

    // push return address
    @Sys.init$ret.0
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push LCL
    @LCL
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push ARG
    @ARG
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push THIS
    @THIS
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push THAT
    @THAT
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // ARG = SP - 5 - nArgs
    @SP
    D=M
    @5
    D=D-A
    @0
    D=D-A
    @ARG
    M=D
    // LCL = SP
    @SP
    D=M
    @LCL
    M=D
    // goto callee
    @Sys.init
    0;JMP
    (Sys.init$ret.0)
    

      (Sys.init)
        
    
// push constant 4000

      @4000
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop pointer 0

      @SP
      M=M-1
      A=M
      D=M
      @THIS
      M=D
    
// push constant 5000

      @5000
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop pointer 1

      @SP
      M=M-1
      A=M
      D=M
      @THAT
      M=D
    

    // push return address
    @Sys.main$ret.0
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push LCL
    @LCL
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push ARG
    @ARG
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push THIS
    @THIS
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push THAT
    @THAT
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // ARG = SP - 5 - nArgs
    @SP
    D=M
    @5
    D=D-A
    @0
    D=D-A
    @ARG
    M=D
    // LCL = SP
    @SP
    D=M
    @LCL
    M=D
    // goto callee
    @Sys.main
    0;JMP
    (Sys.main$ret.0)
    
// pop temp 1

      @SP
      M=M-1
      A=M
      D=M
      @6
      M=D
    

      (LOOP)
    

      @LOOP
      0;JMP
    

      (Sys.main)
        
      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
    
// push constant 4001

      @4001
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop pointer 0

      @SP
      M=M-1
      A=M
      D=M
      @THIS
      M=D
    
// push constant 5001

      @5001
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop pointer 1

      @SP
      M=M-1
      A=M
      D=M
      @THAT
      M=D
    
// push constant 200

      @200
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop local 1

      
      @1
      D=A
      @LCL
      D=D+M
      @lcl_addr
      M=D
      
      @SP
      M=M-1
      A=M
      D=M
      @lcl_addr
      A=M
      M=D
      
// push constant 40

      @40
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop local 2

      
      @2
      D=A
      @LCL
      D=D+M
      @lcl_addr
      M=D
      
      @SP
      M=M-1
      A=M
      D=M
      @lcl_addr
      A=M
      M=D
      
// push constant 6

      @6
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop local 3

      
      @3
      D=A
      @LCL
      D=D+M
      @lcl_addr
      M=D
      
      @SP
      M=M-1
      A=M
      D=M
      @lcl_addr
      A=M
      M=D
      
// push constant 123

      @123
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    

    // push return address
    @Sys.add12$ret.1
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push LCL
    @LCL
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push ARG
    @ARG
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push THIS
    @THIS
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // push THAT
    @THAT
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1
    // ARG = SP - 5 - nArgs
    @SP
    D=M
    @5
    D=D-A
    @1
    D=D-A
    @ARG
    M=D
    // LCL = SP
    @SP
    D=M
    @LCL
    M=D
    // goto callee
    @Sys.add12
    0;JMP
    (Sys.add12$ret.1)
    
// pop temp 0

      @SP
      M=M-1
      A=M
      D=M
      @5
      M=D
    
// push local 0

      
      @0
      D=A
      @LCL
      D=D+M
      @lcl_addr
      M=D
      
      @lcl_addr
      A=M
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
      
// push local 1

      
      @1
      D=A
      @LCL
      D=D+M
      @lcl_addr
      M=D
      
      @lcl_addr
      A=M
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
      
// push local 2

      
      @2
      D=A
      @LCL
      D=D+M
      @lcl_addr
      M=D
      
      @lcl_addr
      A=M
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
      
// push local 3

      
      @3
      D=A
      @LCL
      D=D+M
      @lcl_addr
      M=D
      
      @lcl_addr
      A=M
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
      
// push local 4

      
      @4
      D=A
      @LCL
      D=D+M
      @lcl_addr
      M=D
      
      @lcl_addr
      A=M
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
      
// arithmetic: add

      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=D+M
      M=D
      @SP
      M=M+1
    
// arithmetic: add

      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=D+M
      M=D
      @SP
      M=M+1
    
// arithmetic: add

      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=D+M
      M=D
      @SP
      M=M+1
    
// arithmetic: add

      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=D+M
      M=D
      @SP
      M=M+1
    

      // frame = LCL
      @LCL
      D=M
      @frame
      M=D
      // retAddr = *(frame-5)
      @frame
      D=M
      @5
      D=D-A
      A=D
      D=M
      @retAddr
      M=D
      // *ARG=pop()
      @SP
      M=M-1
      A=M
      D=M
      @ARG
      A=M
      M=D
      // SP=ARG+1
      @ARG
      D=M+1
      @SP
      M=D
      // THAT=*(frame-1)
      @frame
      M=M-1
      A=M
      D=M
      @THAT
      M=D
      // THIS=*(frame-2)
      @frame
      M=M-1
      A=M
      D=M
      @THIS
      M=D
      // ARG=*(frame-3)
      @frame
      M=M-1
      A=M
      D=M
      @ARG
      M=D
      // LCL=*(frame-4)
      @frame
      M=M-1
      A=M
      D=M
      @LCL
      M=D
      // goto retAddr
      @retAddr
      A=M
      0;JMP
    

      (Sys.add12)
        
    
// push constant 4002

      @4002
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop pointer 0

      @SP
      M=M-1
      A=M
      D=M
      @THIS
      M=D
    
// push constant 5002

      @5002
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop pointer 1

      @SP
      M=M-1
      A=M
      D=M
      @THAT
      M=D
    
// push argument 0

      
      @0
      D=A
      @ARG
      D=D+M
      @lcl_addr
      M=D
      
      @lcl_addr
      A=M
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
      
// push constant 12

      @12
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// arithmetic: add

      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=D+M
      M=D
      @SP
      M=M+1
    

      // frame = LCL
      @LCL
      D=M
      @frame
      M=D
      // retAddr = *(frame-5)
      @frame
      D=M
      @5
      D=D-A
      A=D
      D=M
      @retAddr
      M=D
      // *ARG=pop()
      @SP
      M=M-1
      A=M
      D=M
      @ARG
      A=M
      M=D
      // SP=ARG+1
      @ARG
      D=M+1
      @SP
      M=D
      // THAT=*(frame-1)
      @frame
      M=M-1
      A=M
      D=M
      @THAT
      M=D
      // THIS=*(frame-2)
      @frame
      M=M-1
      A=M
      D=M
      @THIS
      M=D
      // ARG=*(frame-3)
      @frame
      M=M-1
      A=M
      D=M
      @ARG
      M=D
      // LCL=*(frame-4)
      @frame
      M=M-1
      A=M
      D=M
      @LCL
      M=D
      // goto retAddr
      @retAddr
      A=M
      0;JMP
    