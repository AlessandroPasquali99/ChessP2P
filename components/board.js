import React from "react";
import { rows } from "../App";
import Square from "./square";

const Board = () => {
  return (
    <table>
      <tbody>
        {rows.map((row, index) => 
         <tr key={index}>
            {row.map((cell) => 
              <td key={cell.getKeyProp()}>
                <Square cell={cell} /> {/* pass the cell as a parameter for the creation of the square */}
              </td>
            )}
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Board;