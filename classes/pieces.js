import { rows } from "../App"
import black_pawn from "./../assets/pieces/black_pawn.png"
import black_rook from "./../assets/pieces/black_rook.png"
import black_horse from "./../assets/pieces/black_horse.png"
import black_king from "./../assets/pieces/black_king.png"
import black_queen from "./../assets/pieces/black_queen.png"
import black_bishop from "./../assets/pieces/black_bishop.png"
import white_pawn from "./../assets/pieces/white_pawn.png"
import white_rook from "./../assets/pieces/white_rook.png"
import white_horse from "./../assets/pieces/white_horse.png"
import white_king from "./../assets/pieces/white_king.png"
import white_queen from "./../assets/pieces/white_queen.png"
import white_bishop from "./../assets/pieces/white_bishop.png"
import placeholder from "./../assets/pieces/placeholder.png"

const GREY = '#707070';
const BLACK = "black";
const WHITE = "white";
const RED = "red"
export var cellList = [];
export var selectedPiece = null;
export var selectedPieceCell = null;

function collisionCheck(rowsIndex, colsIndex, control, cell) {
    if(rows[rowsIndex][colsIndex].getPiece().getPieceType() === placeholder && control === false) {  //check if the cell is empty
        cellList.push(rows[rowsIndex][colsIndex]);
    }
    else if(rows[rowsIndex][colsIndex].getPiece().getColor() !== cell.getPiece().getColor() && control === false) {  //enemy piece check, to block the movement
        cellList.push(rows[rowsIndex][colsIndex]);
        control = true;
    }
    else    //the case of an allied piece on the path will instantly block the movement
        control = true;

    return control;
}

function cellHighlight() {
    for(var i=0; i<cellList.length; i++) {
        cellList[i].setIsHighlighted(true);
        var square = document.getElementById(cellList[i].getId());
        square.style.background = RED;
    }
}

export function changeCellBG() {
    if(cellList.length !== 0) {
        cellList.forEach(element => {
            var square = document.getElementById(element.getId());
            if(element.getColor() === BLACK) {
                square.style.background = GREY;
            }
            else if(element.getColor() === WHITE) {
                square.style.background = WHITE;
            }
            element.setIsHighlighted(false);
        });
    }
    cellList = [];
}

//generic Piece ----
export class Piece {
    constructor() { 
      this.img = placeholder; 
    }
  
    getPieceType() { return this.img; }
    getColor() { /*to be inherited...*/ }
    movement() { /*to be inherited...*/ }
}
  //Pawn ----
export class Pawn extends Piece {
    constructor(color) {
        super();
        this.moved = false;
        this.color = color;
        if(color === BLACK)
            this.img = black_pawn;
        else if(color === WHITE)
            this.img = white_pawn;
    }
    
    setMoved() { this.moved = true; }
    getColor() { return this.color; }
    movement(cell) {
        selectedPieceCell = cell;
        selectedPiece = cell.getPiece();
        changeCellBG(cell);
        var rowsIndex = cell.getCellIndex()[0];
        var colsIndex = cell.getCellIndex()[1];
        var e = 1;
        //conditions to move
        if(cell.getPiece().moved === true) {
            if(cell.getPiece().getColor() === WHITE)    //white pawn movement
                if(rows[rowsIndex-e][colsIndex].getPiece().getPieceType() === placeholder)   //checking if the piece would go in an empty cell
                    cellList.push(rows[rowsIndex-e][colsIndex]);
            
            if(cell.getPiece().getColor() === BLACK)   //black pawn movement
                if(rows[rowsIndex+e][colsIndex].getPiece().getPieceType() === placeholder)    //checking if the piece would go in an empty cell
                    cellList.push(rows[rowsIndex+e][colsIndex]);     
        }
        else if(cell.getPiece().moved === false) {
            if(cell.getPiece().getColor() === WHITE)    //white pawn special movement
                for(var i=1; i<3; i++)
                    if(rows[rowsIndex-i][colsIndex].getPiece().getPieceType() === placeholder)
                        cellList.push(rows[rowsIndex-i][colsIndex]);
            
            if(cell.getPiece().getColor() === BLACK)   //black pawn special movement
                for(var c=1; c<3; c++)
                    if(rows[rowsIndex+c][colsIndex].getPiece().getPieceType() === placeholder)    
                        cellList.push(rows[rowsIndex+c][colsIndex]);
        }

        //conditions to eat for WHITE pawns
        if(cell.getPiece().getColor() === WHITE) {
            if(colsIndex+e < rows.length) {
                if(rows[rowsIndex-e][colsIndex+e].getPiece().getColor() !== cell.getPiece().getColor() && 
                    rows[rowsIndex-e][colsIndex+e].getPiece().getPieceType() !== placeholder) //condition to determine if in the selected square there's a suitable piece to be eaten
                    cellList.push(rows[rowsIndex-e][colsIndex+e]);
            }
            if(colsIndex-e >= 0) {
                if(rows[rowsIndex-e][colsIndex-e].getPiece().getColor() !== cell.getPiece().getColor() && 
                    rows[rowsIndex-e][colsIndex-e].getPiece().getPieceType() !== placeholder) //condition to determine if in the selected square there's a suitable piece to be eaten
                    cellList.push(rows[rowsIndex-e][colsIndex-e]);
            }
        }
        
        //conditions to eat for BLACK pawns
        if(cell.getPiece().getColor() === BLACK) {
            if(colsIndex+e < rows.length) {
                if(rows[rowsIndex+e][colsIndex+e].getPiece().getColor() !== cell.getPiece().getColor() && 
                    rows[rowsIndex+e][colsIndex+e].getPiece().getPieceType() !== placeholder) //condition to determine if in the selected square there's a suitable piece to be eaten
                    cellList.push(rows[rowsIndex+e][colsIndex+e]);
            }
            if(colsIndex-e >= 0) {
                if(rows[rowsIndex+e][colsIndex-e].getPiece().getColor() !== cell.getPiece().getColor() && 
                    rows[rowsIndex+e][colsIndex-e].getPiece().getPieceType() !== placeholder) //condition to determine if in the selected square there's a suitable piece to be eaten
                    cellList.push(rows[rowsIndex+e][colsIndex-e]);
            }
        }
        cellHighlight();
    }
}
  //Rook ----
export class Rook extends Piece {
    constructor(color) {
        super(color);
        this.color = color;
        if(color === BLACK)
            this.img = black_rook;
        else if(color === WHITE)
            this.img = white_rook;
    }
    getColor() { return this.color; }
    movement(cell) {
        selectedPieceCell = cell;
        selectedPiece = cell.getPiece();
        changeCellBG();
        var rowsIndex = cell.getCellIndex()[0];
        var colsIndex = cell.getCellIndex()[1];
        var upperControl = false;   //variables 
        var lowerControl = false;   //to check
        var leftControl = false;    //for obstacles
        var rightControl = false;   //for the movement
        var e = 1;

        for(var i=0; i<rows.length; i++) {
            //upper movement
            if(rowsIndex-e >= 0)  //condition to check if the movement would go out of the chessboard
                upperControl = collisionCheck(rowsIndex-e, colsIndex, upperControl, cell);
            //lower movement
            if(rowsIndex+e < rows.length)  //condition to check if the movement would go out of the chessboard
                lowerControl = collisionCheck(rowsIndex+e, colsIndex, lowerControl, cell);

            //left movement
            if(colsIndex-e >= 0)  //condition to check if the movement would go out of the chessboard
                leftControl = collisionCheck(rowsIndex, colsIndex-e, leftControl, cell);
            
            //right movement
            if(colsIndex+e < rows.length) //condition to check if the movement would go out of the chessboard
                rightControl = collisionCheck(rowsIndex, colsIndex+e, rightControl, cell);
            e++;
        }
        cellHighlight();
    }
}
  //Horse ----
export class Horse extends Piece {
    constructor(color) {
        super(color);
        this.color = color;
        if(color === BLACK)
            this.img = black_horse;
        else if(color === WHITE)
            this.img = white_horse;
    }
    getColor() { return this.color; }
    movement(cell) {
        selectedPieceCell = cell;
        selectedPiece = cell.getPiece();
        changeCellBG();
        var rowsIndex = cell.getCellIndex()[0];
        var colsIndex = cell.getCellIndex()[1];
        var mov1 = false;   //variables to check the stop the movement in case of collision...
        var mov2 = false;
        var mov3 = false;
        var mov4 = false;
        var mov5 = false;
        var mov6 = false;
        var mov7 = false;
        var mov8 = false;   //...

        for(var i=0; i<rows.length; i++) {
            for(var c=0; c<rows[i].length; c++) {
                if(i === rowsIndex-1 && c === colsIndex-2)
                    mov1 = collisionCheck(i, c, mov1, cell);
                else if(i === rowsIndex-2 && c === colsIndex-1)
                    mov2 = collisionCheck(i, c, mov2, cell);
                else if(i === rowsIndex-1 && c === colsIndex+2) 
                    mov3 = collisionCheck(i, c, mov3, cell);
                else if(i === rowsIndex-2 && c === colsIndex+1)
                    mov4 = collisionCheck(i, c, mov4, cell);
                else if(i === rowsIndex+1 && c === colsIndex-2)
                    mov5 = collisionCheck(i, c, mov5, cell);
                else if(i === rowsIndex+1 && c === colsIndex+2)
                    mov6 = collisionCheck(i, c, mov6, cell);
                else if(i === rowsIndex+2 && c === colsIndex-1)
                    mov7 = collisionCheck(i, c, mov7, cell);
                else if(i === rowsIndex+2 && c === colsIndex+1)
                    mov8 = collisionCheck(i, c, mov8, cell);
            }
        }
        cellHighlight();
    }
}
  //Bishop ----
export class Bishop extends Piece {
    constructor(color) {
        super(color);
        this.color = color;
        if(color === BLACK)
            this.img = black_bishop;
        else if(color === WHITE)
            this.img = white_bishop;
    }
    getColor() { return this.color; }
    movement(cell) {
        selectedPieceCell = cell;
        selectedPiece = cell.getPiece();
        changeCellBG();
        var rowsIndex = cell.getCellIndex()[0];
        var colsIndex = cell.getCellIndex()[1];
        var upLeftControl = false;      //variables to control collisions on the path...
        var upRightControl = false;
        var downLeftControl = false;
        var downRightControl = false;   //...
        var e = 1;
        for(var i=0; i<rows.length; i++) {
            if(rowsIndex-e >= 0) {
                //upper left movement
                if(colsIndex-e >= 0)
                    upLeftControl = collisionCheck(rowsIndex-e, colsIndex-e, upLeftControl, cell);  //call to the collision check method to block the movement in case of pieces on the path
                //upper right movement    
                if(colsIndex+e < rows.length)
                    upRightControl = collisionCheck(rowsIndex-e, colsIndex+e, upRightControl, cell);
            }
            if(rowsIndex+e < rows.length) {
                //lower left movement
                if(colsIndex-e >= 0)
                    downLeftControl = collisionCheck(rowsIndex+e, colsIndex-e, downLeftControl, cell);
                //lower right movement    
                if(colsIndex+e < rows.length)
                    downRightControl = collisionCheck(rowsIndex+e, colsIndex+e, downRightControl, cell);
            } 
            e++;
        }
        cellHighlight();
    }
}
  //Queen ----
export class Queen extends Piece {
    constructor(color) {
        super(color);
        this.color = color;
        if(color === BLACK)
            this.img = black_queen;
        else if(color === WHITE)
            this.img = white_queen;
    }
    getColor() { return this.color; }
    movement(cell) {
        selectedPieceCell = cell;
        selectedPiece = cell.getPiece();
        changeCellBG();
        var rowsIndex = cell.getCellIndex()[0];
        var colsIndex = cell.getCellIndex()[1];
        var upperControl = false;    //variables to control collisions on the path...
        var lowerControl = false;
        var leftControl = false;
        var rightControl = false;
        var upLeftControl = false;
        var upRightControl = false;
        var downLeftControl = false;
        var downRightControl = false;    //...
        var e = 1;
        for(var i=0; i<rows.length; i++) {
            //Rook movement
            //upper movement
            if(rowsIndex-e >= 0)  //condition to check if the movement would go out of the chessboard
                upperControl = collisionCheck(rowsIndex-e, colsIndex, upperControl, cell);
            //lower movement
            if(rowsIndex+e < rows.length)  //condition to check if the movement would go out of the chessboard
                lowerControl = collisionCheck(rowsIndex+e, colsIndex, lowerControl, cell);

            //left movement
            if(colsIndex-e >= 0)  //condition to check if the movement would go out of the chessboard
                leftControl = collisionCheck(rowsIndex, colsIndex-e, leftControl, cell);
            
            //right movement
            if(colsIndex+e < rows.length) //condition to check if the movement would go out of the chessboard
                rightControl = collisionCheck(rowsIndex, colsIndex+e, rightControl, cell);
            
            if(rowsIndex-e >= 0) {
                if(colsIndex-e >= 0)
                    upLeftControl = collisionCheck(rowsIndex-e, colsIndex-e, upLeftControl, cell);  //call to the collision check method to block the movement in case of pieces on the path
                if(colsIndex+e < rows.length)
                    upRightControl = collisionCheck(rowsIndex-e, colsIndex+e, upRightControl, cell);
            }
            if(rowsIndex+e < rows.length) {
                if(colsIndex-e >= 0)
                    downLeftControl = collisionCheck(rowsIndex+e, colsIndex-e, downLeftControl, cell);
                if(colsIndex+e < rows.length)
                    downRightControl = collisionCheck(rowsIndex+e, colsIndex+e, downRightControl, cell);
            }
            e++;
        }
        cellHighlight();
    }
}
  //King ----
export class King extends Piece {
    constructor(color) {
        super(color);
        this.color = color;
        if(color === BLACK)
            this.img = black_king;
        else if(color === WHITE)
            this.img = white_king;
    }
    getColor() { return this.color; }
    movement(cell) {    //same movement of the queen, except the 'e' variable won't be incremented because of the one step of the king's movement
        selectedPieceCell = cell;
        selectedPiece = cell.getPiece();
        changeCellBG();
        var rowsIndex = cell.getCellIndex()[0];
        var colsIndex = cell.getCellIndex()[1];
        var upperControl = false;    //variables to control collisions on the path...
        var lowerControl = false;
        var leftControl = false;
        var rightControl = false;
        var upLeftControl = false;
        var upRightControl = false;
        var downLeftControl = false;
        var downRightControl = false;    //...
        var e = 1;
        for(var i=0; i<rows.length; i++) {
            //upper movement
            if(rowsIndex-e >= 0)  //condition to check if the movement would go out of the chessboard
                upperControl = collisionCheck(rowsIndex-e, colsIndex, upperControl, cell);
            //lower movement
            if(rowsIndex+e < rows.length)  //condition to check if the movement would go out of the chessboard
                lowerControl = collisionCheck(rowsIndex+e, colsIndex, lowerControl, cell);

            //left movement
            if(colsIndex-e >= 0)  //condition to check if the movement would go out of the chessboard
                leftControl = collisionCheck(rowsIndex, colsIndex-e, leftControl, cell);
            
            //right movement
            if(colsIndex+e < rows.length) //condition to check if the movement would go out of the chessboard
                rightControl = collisionCheck(rowsIndex, colsIndex+e, rightControl, cell);
            
            if(rowsIndex-e >= 0) {
                if(colsIndex-e >= 0)
                    upLeftControl = collisionCheck(rowsIndex-e, colsIndex-e, upLeftControl, cell);  //call to the collision check method to block the movement in case of pieces on the path
                if(colsIndex+e < rows.length)
                    upRightControl = collisionCheck(rowsIndex-e, colsIndex+e, upRightControl, cell);
            }
            if(rowsIndex+e < rows.length) {
                if(colsIndex-e >= 0)
                    downLeftControl = collisionCheck(rowsIndex+e, colsIndex-e, downLeftControl, cell);
                if(colsIndex+e < rows.length)
                    downRightControl = collisionCheck(rowsIndex+e, colsIndex+e, downRightControl, cell);
            }
        }
        cellHighlight();
    }
}