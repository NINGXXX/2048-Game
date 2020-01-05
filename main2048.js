var board=new Array();
var score=0;
var hasConflicted=new Array();

var startX=0;
var startY=0;
var endX=0;
var endY=0;

$(document).ready(function () {
    prepareForMobile();
    newGame();
});

function prepareForMobile() {

    $("#grid-container").css('width',gridContainerWidth-2*cellSpace);
    $("#grid-container").css('height',gridContainerWidth-2*cellSpace);
    $("#grid-container").css('padding',cellSpace);
    $("#grid-container").css('border-radius',0.02*gridContainerWidth);
    $(".grid-cell").css('width',cellSideLength);
    $(".grid-cell").css('height',cellSideLength);
    $(".grid-cell").css('border-radius',0.02*cellSideLength);
}

function newGame(){
    //初始化棋盘格
    init();
    //在随机两个格子中生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            var gridCell=$("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }

    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    upDateBoardView();
    score=0;
}

function upDateBoardView() {
    $(".number-cell").remove();
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$('#number-cell-'+i+'-'+j);

            //没有数字的格子
            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }
            //有数字的格子
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBgColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j]=false;
        }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber() {
    //判断棋盘是否还有格子
    if(noSpace(board))
        return false;

    //随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    var times=0;
    while(times<50){
        if(board[randx][randy]==0)
            break;
        var randx=parseInt(Math.floor(Math.random()*4));
        var randy=parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if(times==50){
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
            }
    }

    //随机一个数字
    var randNum=Math.random()<0.5?2:4;

    //在随机位置显示随机数
    board[randx][randy]=randNum;
    showNumWithAnimation(randx,randy,randNum);
    return true;
}

$(document).keydown(function(event){
    switch (event.keyCode) {
        case 37:  //left
            event.preventDefault();   //阻挡行为发生时一些默认效果
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameOver()",300);
            }
            break;

        case 38:  //up
            event.preventDefault();   
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameOver()",300);
            }
            break;

        case 39:  //right
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameOver()",300);
            }
            break;

        case 40:  //down
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameOver()",300);
            }
            break;
        default:  //default
            break;
    }
});

document.addEventListener('touchstart',function(event){
    startX=event.touches[0].pageX;
    startY=event.touches[0].pageY;
});
document.addEventListener('touchend',function(event){
    endX=event.changedTouches[0].pageX;
    endY=event.changedTouches[0].pageY;

    var deltaX=endX-startX;
    var deltaY=endY-startY

    if(Math.abs(deltaX)<0.3*documentWidth&&Math.abs(deltaY)<0.3*documentWidth){
        return;
    }

    if(Math.abs((deltaX))>=Math.abs(deltaY)) {
        if(deltaX>0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameOver()",300);
            }
        }
        else{
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameOver()",300);
            }
        }
    }
    else{
        if(deltaY<0){
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameOver()",300);
            }
        }
        else{
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameOver()",300);
            }
        }
    }
});

function isgameOver() {
    if(noSpace(board)&&noMove(board))
        gameOver();

}

function gameOver() {
    alert('Game Over');
}

function moveLeft() {
    if(!canMoveLeft(board))
        return false;

    //moveLeft
    for(var i=0;i<4;i++)
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0&&noBlockHorizon(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j]&&noBlockHorizon(i,k,j,board)&&!hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    setTimeout("upDateBoardView()",200);
    return true;
}

function moveUp() {
    if(!canMoveUp(board))
        return false;

    //moveUp
    for(var j=0;j<4;j++)
        for(var i=1;i<4;i++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j]&&noBlockVertical(i,k,j,board)&&!hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    setTimeout("upDateBoardView()",200);
    return true;
}

function moveRight() {
    if(!canMoveRight(board))
        return false;

    //moveRight
    for(var i=0;i<4;i++)
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizon(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j]&&noBlockHorizon(i,j,k,board)&&!hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    setTimeout("upDateBoardView()",200);
    return true;
}

function moveDown() {
    if(!canMoveDown(board))
        return false;

    //moveUp
    for(var j=0;j<4;j++)
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(k,i,j,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j]&&noBlockVertical(k,i,j,board)&&!hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    setTimeout("upDateBoardView()",200);
    return true;
}
