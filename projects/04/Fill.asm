(LOOP)
    // initial values
    @SCREEN
    D=A
    @addr
    M=D
    @KBD
    D=A-D
    @imax
    M=D
    @i
    M=0

    @SCREEN
    D=M
    
    // Get keyboard
    @KBD
    D=M+D
    // branch on keyboard value 0 and SCREEN already EMPTY
    @SKIP
    D;JEQ
    // branch on keyboard value 0 and screen being -1
    @EMPTY
    D+1;JEQ
    // branch on keyboard value !0
    @FILL
    D;JNE

    (FILL)
        @i
        D=M
        @imax
        D=M-D

        // if we visited all 8k registers
        @LOOP
        D;JEQ
        // else

        @addr
        A=M
        M=-1
        @i
        M=M+1
        @addr
        M=M+1

        @FILL
        0;JMP

    (EMPTY)
        @i
        D=M
        @imax
        D=M-D

        // if we visited all 8k registers
        @LOOP
        D;JEQ
        // else

        @addr
        A=M
        M=0
        @i
        M=M+1
        @addr
        M=M+1

        @EMPTY
        0;JMP

    (SKIP)
        @LOOP
        0;JMP

@LOOP
0;JMP
