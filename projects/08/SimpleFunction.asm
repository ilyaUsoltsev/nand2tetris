
      (SimpleFunction.test)
        
      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
      
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
      
      @0
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    
      
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
    
// arithmetic: not

      @SP
      M=M-1
      A=M
      M=!M
      @SP
      M=M+1
    
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
    