// push constant 0

      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop local 0

      
      @0
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
    
// pop local 0

      
      @0
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
      @LOOP
      D;JGT
    
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
      