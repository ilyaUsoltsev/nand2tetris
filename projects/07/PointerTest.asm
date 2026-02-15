// push constant 3030 

      @3030
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
      @THAT
      M=D
    
// push constant 3040 

      @3040
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
    
// push constant 32 

      @32
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop this 2 

      
      @2
      D=A
      @THIS
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
      
// push constant 46 

      @46
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// pop that 6 

      
      @6
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
      
// push pointer 0 

      @THAT
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
// push pointer 1 

      @THAT
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
    
// push this 2 

      
      @2
      D=A
      @THIS
      D=D+M
      @lcl_addr
      M=D
      
      @lcl_addr
      A=M
      M=D
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
      D=D-M
      M=D
      @SP
      M=M+1
    
// push that 6 

      
      @6
      D=A
      @THIS
      D=D+M
      @lcl_addr
      M=D
      
      @lcl_addr
      A=M
      M=D
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
    