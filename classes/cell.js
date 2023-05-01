import Square from "./../components/square.js"
import { Bishop, Horse, King, Piece, Queen, Rook, Pawn } from "./pieces.js"

class Cell {
    constructor(color, rowIndex, colIndex, keyProp) {
      this.color = color;   //color of the cell 'white' or 'black'
      this.piece = new Piece();   //piece in the cell, initialized as a general piece to fill the cell with the 'placeholder'
      this.index = [rowIndex, colIndex];  //index of the cell in the array 'rows'
      this.isHighlighted = false;   //check if the cell is a possible cell for the movement, false is not, true is good for movement
      this.keyProp = keyProp;   //needed to avoid a warning while drawing the table, is just a unique name, could be used the 'id' property instead
      this.id = "cell-" + this.index[0] + "-" + this.index[1];   //id of the cell, every cell has is own id to make possible the change of color of the background
    }
    
    //get methods
    getColor() { return this.color; }
    getPiece() { return this.piece; }
    getPieceToString() {  //just for debugging purpose
      if(this.piece instanceof Pawn) 
        return "Pawn";
      else  if(this.piece instanceof Rook) 
        return "Rook";
      else  if(this.piece instanceof Horse) 
        return "Horse";
      else  if(this.piece instanceof Bishop) 
        return "Bishop";
      else  if(this.piece instanceof Queen) 
        return "Queen";
      else  if(this.piece instanceof King) 
        return "King";
    }
    getCellIndex() { return this.index; }
    getKeyProp() { return this.keyProp; }
    getId() { return this.id; }
    getHL() { return this.isHighlighted; }  //get method for the 'isHighlighted' property
    //set methods
    setIsHighlighted(newIsHightlighted) { this.isHighlighted = newIsHightlighted; }
    setColor(newColor) { this.color = newColor; }
    setPiece(newPiece) { this.piece = newPiece; }
    //draw method to draw the square in the table
    draw() { return ( 
      <Square color={this.color} piece={this.piece.getPieceType()} function={this.piece.movement} key={this.keyProp} id={this.id} /> ); }
}
export default Cell;