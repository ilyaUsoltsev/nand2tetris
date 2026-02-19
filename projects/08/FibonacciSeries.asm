// push argument 1

      
      @1
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
      
// pop pointer 1

      @SP
      M=M-1
      A=M
      D=M
      @THAT
      M=D
    
// push constant 0

      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop that 0

      
      @0
      D=A
      @THAT
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
      
// push constant 1

      @1
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop that 1

      
      @1
      D=A
      @THAT
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
      
// push constant 2

      @2
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// arithmetic: sub

      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=M-D
      M=D
      @SP
      M=M+1
    
// pop argument 0

      
      @0
      D=A
      @ARG
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
      

      (LOOP)
    
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
      

      @SP
      M=M-1
      A=M
      D=M
      @COMPUTE_ELEMENT
      D;JGT
    

      @END
      0;JMP
    

      (COMPUTE_ELEMENT)
    
// push that 0

      
      @0
      D=A
      @THAT
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
      
// push that 1

      
      @1
      D=A
      @THAT
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
    
// pop that 2

      
      @2
      D=A
      @THAT
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
      
// push pointer 1

      @THAT
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// push constant 1

      @1
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
      
// push constant 1

      @1
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// arithmetic: sub

      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=M-D
      M=D
      @SP
      M=M+1
    
// pop argument 0

      
      @0
      D=A
      @ARG
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
      

      @LOOP
      0;JMP
    

      (END)
    