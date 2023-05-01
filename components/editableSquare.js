import React from "react";

const EditableSquare = ({ cell }) => {
  
    const handleClick = () => { cell.getPiece().movement(cell); }
  
    return(
      <button className={cell.getColor()} onClick={handleClick} id={cell.getId()}>
          <img src={cell.getPiece().getPieceType()} alt={""} id={cell.getId() + "-img"} />
      </button>
    );
  }
  
  export default EditableSquare;