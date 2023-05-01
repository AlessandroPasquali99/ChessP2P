import React from "react";
import { selectedPiece, changeCellBG, selectedPieceCell, Piece, King, Pawn } from "./../classes/pieces.js";
import placeholder from "./../assets/pieces/placeholder.png"
import { myColor, toggleTurn, playerTurn, myColorChange } from "./../App.js"

//visual component for the class cell, the drawable element
const Square = ({ cell }) => {  //pass cell as a parameter, from that i can use the functions to build my square
  
  const handleClick = () => { 
    if(playerTurn === myColor) {  //check if my color is equal to the one that has to move now, if not than just don't do anything
      if(cell.getHL() === false && myColor === cell.getPiece().getColor()) {  //call the movement if the isHighlight boolean is false, to highlight the possible cells for the movement, and also check if the color of the piece matches the color of the player
        cell.getPiece().movement(cell);   
      }
      else if(cell.getHL() === true) {  //change the piece position and draws the images in the square when clicking on an higlighted square
        var pieceToString = selectedPieceCell.getPieceToString();
        var pieceEaten = cell.getPiece(); //piece that is getting replaced
        var victory = false;  //becomes true when the king is getting replaced by another piece
        
        cell.setPiece(selectedPiece);
        changeCellBG();
        document.getElementById(cell.getId() + "-img").src = selectedPiece.getPieceType();
        selectedPieceCell.setPiece(new Piece());
        document.getElementById(selectedPieceCell.getId() + "-img").src = placeholder;
        
        if(selectedPiece instanceof Pawn) //pawn special condition to limit the movement after their first movement
          selectedPiece.setMoved();
        if(pieceEaten instanceof King) {  //victory condition
          victory = true;
          myColorChange("not assigned");  //change the color to freeze the chessboard
          document.getElementById("statusInfo").innerHTML = "victory";
        }
        
        toggleTurn(cell, selectedPieceCell, selectedPiece, pieceToString, victory); //the 'pieceToString' parameter is to know the cast needed when the data are received
      }
    }
  }

  return(
    <button className={cell.getColor()} onClick={handleClick} id={cell.getId()} >
        <img src={cell.getPiece().getPieceType()} alt={""} id={cell.getId() + "-img"} />
    </button>
  );
}

export default Square;