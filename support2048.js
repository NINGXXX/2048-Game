documentWidth=window.screen.availWidth;
gridContainerWidth=0.92*documentWidth;
cellSideLength=0.18*documentWidth;
cellSpace=0.04*documentWidth;

function getPosTop(i,j) {
    return cellSpace+i*(cellSpace+cellSideLength);
}

function getPosLeft(i,j) {
    return cellSpace+j*(cellSpace+cellSideLength);
}


function getNumberBgColor(number) {
    switch (number) {
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f5c529";break;
        case 32:return "#f6d299";break;
        case 64:return "#f7e43c";break;
        case 128:return "#e4d256";break;
        case 256:return "#acf7e6";break;
        case 512:return "#9e6";break;
        case 1024:return "#664dc1";break;
        case 2048:return "#4d4";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93d";break;
    }
    return "black";
}

function getNumberColor(number) {
    if(number<=4){
        return "#776e65";
    }
    return "white";
}

function noSpace(board) {
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            if(board[i][j]==0)
                return false;
        }
    return true;
}

function canMoveLeft(board) {
    for(var i=0;i<4;i++)
        for (var j=1;j<4;j++)
            if(board[i][j]!=0)
                if(board[i][j-1]==0||board[i][j-1]==board[i][j])
                    return true;
    return false;
}

function canMoveRight(board) {
    for(var i=0;i<4;i++)
        for (var j=0;j<3;j++)
            if(board[i][j]!=0)
                if(board[i][j+1]==0||board[i][j+1]==board[i][j])
                    return true;
    return false;
}

function canMoveUp(board) {
    for (var j=0;j<4;j++)
        for(var i=1;i<4;i++)
            if(board[i][j]!=0)
                if(board[i-1][j]==0||board[i-1][j]==board[i][j])
                    return true;
    return false;
}

function canMoveDown(board) {
    for (var j=0;j<4;j++)
        for(var i=0;i<3;i++)
            if(board[i][j]!=0)
                if(board[i+1][j]==0||board[i+1][j]==board[i][j])
                    return true;
    return false;
}


function noBlockHorizon(row, col1, col2, board) {
    for(var i=col1+1;i<col2;i++)
        if(board[row][i]!=0)
            return false;
    return  true;
}

function noBlockVertical(row1, row2, col, board) {
    for(var i=row2+1;i<row1;i++)
        if(board[i][col]!=0)
            return false;
    return true;
}

function noMove(board) {
    if(canMoveDown(board)||canMoveLeft(board)||canMoveRight(board)||canMoveUp(board))
        return false;
    return true;
}

