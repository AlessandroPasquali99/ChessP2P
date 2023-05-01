import './assets/App.css';
import './assets/style.css';
import Peer from "peerjs";
import React from 'react';
import Board from "./components/board.js"
import Cell from "./classes/cell.js"
import { cellList, changeCellBG, Piece, selectedPiece, selectedPieceCell } from "./classes/pieces.js"
import { Pawn } from "./classes/pieces.js"
import { Horse } from "./classes/pieces.js"
import { Rook } from "./classes/pieces.js"
import { Bishop } from "./classes/pieces.js"
import { Queen } from "./classes/pieces.js"
import { King } from "./classes/pieces.js"
import placeholder from "./assets/pieces/placeholder.png"

var NOT_ASSIGNED = "not assigned";
var BLACK = "black";
var WHITE = "white";
export var turn = 1;
export var playerTurn = WHITE;
export var myColor = NOT_ASSIGNED;

//managing connection
var localPeer = new Peer();
var conn = null;

export function myColorChange(newColor) {
  myColor = newColor;
}

function connection() {
  if(conn === null || myColor === NOT_ASSIGNED) {
    conn = localPeer.connect(document.getElementById("remoteID").value);
    //request connection to the other peer
    conn.on('open', function() {
      myColor = WHITE;
      openingConnection();

      //receiving data
      conn.on('data', function(data) {
        receiveData(data);
      })

      //closing connection
      conn.on('close', function() {
        conn = null;
        document.getElementById("opponentInfo").innerHTML = "Disconnected";
        myColor = NOT_ASSIGNED;
        document.getElementById("colorInfo").innerHTML = myColor;
        turn = 1;
        playerTurn = "disconnected";
        document.getElementById("playerTurnInfo").innerHTML = playerTurn;
        closingConnection();
      })
    })
  } 
  else if(conn != null)
    alert("already connected to an opponent");
}

function disconnection() {
  if(window.confirm("Are you sure you want to disconnect?") === true)
    conn.close();
}

function openingConnection() {
  document.getElementById("colorInfo").innerHTML = myColor;
  document.getElementById("opponentInfo").innerHTML = conn.peer;
  document.getElementById("colorInfo").innerHTML = myColor;
  turn = 1;
  playerTurn = WHITE;
  document.getElementById("playerTurnInfo").innerHTML = playerTurn;
}

function closingConnection() {
  conn = null;
  document.getElementById("opponentInfo").innerHTML = "Disconnected";
  myColor = NOT_ASSIGNED;
  document.getElementById("colorInfo").innerHTML = myColor;
  turn = 1;
  document.getElementById("turnInfo").innerHTML = turn;
  playerTurn = "disconnected";
  document.getElementById("playerTurnInfo").innerHTML = playerTurn;
  document.getElementById("statusInfo").innerHTML = "";
  chessboardReset();
  //alert("Opponent has disconnected");
}

function receiveData(data) {
  //retrieving data
  playerTurn = data[0];
  turn = data[1];
  var arrivingCell = Object.assign(new Cell(), data[2]);  //the cast is necessary because when the data are transmitted they will be converted in Object type
  var startingCell = Object.assign(new Cell(), data[3]);
  
  //conditions to know which cast is needed
  var pieceToMove;
  if(data[5] === "Pawn")
    pieceToMove = Object.assign(new Pawn(), data[4]);
  else if(data[5] === "Horse")
    pieceToMove = Object.assign(new Horse(), data[4]);
  else if(data[5] === "Rook")
    pieceToMove = Object.assign(new Rook(), data[4]);
  else if(data[5] === "Bishop")
    pieceToMove = Object.assign(new Bishop(), data[4]);
  else if(data[5] === "Queen")
    pieceToMove = Object.assign(new Queen(), data[4]);
  else if(data[5] === "King")
    pieceToMove = Object.assign(new King(), data[4]);
  
  //updating info
  document.getElementById("playerTurnInfo").innerHTML = playerTurn;
  document.getElementById("turnInfo").innerHTML = turn;
  
  //updating piece position
  var cellRowIndex = arrivingCell.getCellIndex()[0];
  var cellColIndex = arrivingCell.getCellIndex()[1];
  rows[cellRowIndex][cellColIndex].setPiece(pieceToMove);
  document.getElementById(arrivingCell.getId() + "-img").src = pieceToMove.getPieceType();
  
  cellRowIndex = startingCell.getCellIndex()[0];
  cellColIndex = startingCell.getCellIndex()[1];
  rows[cellRowIndex][cellColIndex].setPiece(new Piece());
  document.getElementById(startingCell.getId() + "-img").src = placeholder;
  
  if(data[6] === true) {
    myColor = NOT_ASSIGNED;
    document.getElementById("statusInfo").innerHTML = "defeated";
  }

}

export var rows = [];
var cols = [];

function drawChessboard() {
  var cell;
  rows = [];
  var keyProp = 0;
  for(var i=0; i<8; i++) {
    cols = [];
    for(var c=0; c<8; c++) {
      if(i%2 !== 0) {
        if(c%2 === 0) {
          cell = new Cell(WHITE, i, c, keyProp);
        }
        else {
          cell = new Cell(BLACK, i, c, keyProp);
        }
      }
      else {
        if(c%2 === 0) {
          cell = new Cell(BLACK, i, c, keyProp);
        }
        else {
          cell = new Cell(WHITE, i, c, keyProp);
        }
      }
      cols.push(cell);
      keyProp++;
    }
    rows.push(cols);
  }
  initialPiecePlacing();
};

function initialPiecePlacing() {
  rows[0][0].setPiece(new Rook(BLACK));
  rows[0][7].setPiece(new Rook(BLACK));
  rows[0][1].setPiece(new Horse(BLACK));
  rows[0][6].setPiece(new Horse(BLACK));
  rows[0][2].setPiece(new Bishop(BLACK));
  rows[0][5].setPiece(new Bishop(BLACK));
  rows[0][4].setPiece(new Queen(BLACK));
  rows[0][3].setPiece(new King(BLACK));

  rows[7][0].setPiece(new Rook(WHITE));
  rows[7][7].setPiece(new Rook(WHITE));
  rows[7][1].setPiece(new Horse(WHITE));
  rows[7][6].setPiece(new Horse(WHITE));
  rows[7][2].setPiece(new Bishop(WHITE));
  rows[7][5].setPiece(new Bishop(WHITE));
  rows[7][4].setPiece(new Queen(WHITE));
  rows[7][3].setPiece(new King(WHITE));

  for(var i=0; i<8; i++) {   //pawn placing
    rows[1][i].setPiece(new Pawn(BLACK));
    rows[6][i].setPiece(new Pawn(WHITE));
  }
}

function chessboardReset() {
  changeCellBG();

  rows.forEach(row => {
    row.forEach(cell => {
      cell.setPiece(new Piece());
      document.getElementById(cell.getId() + "-img").src = placeholder;
    });
  });

  initialPiecePlacing();

  rows.forEach(row => {
    row.forEach(cell => {
      document.getElementById(cell.getId() + "-img").src = cell.getPiece().getPieceType();
    });
  });
}

export function toggleTurn(cell, selectedPieceCell, selectedPiece, pieceType, victory) {  //change player turn, and sends the informations to the other player
  turn++;
  if(turn%2 !== 0) 
    playerTurn = "white";
  else if(turn%2 === 0) 
    playerTurn = "black";
  
  document.getElementById("turnInfo").innerHTML = turn;
  document.getElementById("playerTurnInfo").innerHTML = playerTurn;
  var data = [playerTurn, turn, cell, selectedPieceCell, selectedPiece, pieceType, victory];
  conn.send(data);
}

//main page
function App() {
  //filling the localID text input with the local ID
  localPeer.on('open', function() {
    document.getElementById('localID').innerHTML = localPeer.id;
  });

  //receiving connection
  if(conn === null) {
    localPeer.on('connection', function(connection) {
      conn = connection;
      
      //when the connection is opened 
      connection.on('open', function() {
        myColor = BLACK;
        openingConnection();
      })
  
      //when the peer receives data
      connection.on('data', function(data) {
        receiveData(data);
      })
  
      //when the connection is closed
      connection.on('close', function() {
        closingConnection();
      })
    })
  }

  return (
    <div className="App" onLoad={ drawChessboard() } id="mainDiv">
        
      <div className="interface">
        <div className="idContainer">
          <span> My ID : </span>
          <span id="localID" className="localIdSpan"></span>
          <br></br>
          <br></br>
          <span> Remote ID : </span>
          <input type="text" id="remoteID"></input>
          <br></br>
          <br></br>
          <button id="connectBtn" onClick={ connection } className="connectionButton"> connect </button>
          <br></br>
          <br></br>
          <button id="disconnectBtn" onClick={ disconnection } className="connectionButton"> disconnect </button>
        </div>

        <div className="board">
          <Board />
        </div>
        
        <div className="info">
          <span> Opponent: </span>
          <span id="opponentInfo"></span>
          <br></br>
          <br></br>
          <span> color turn: </span>
          <span id="playerTurnInfo"> { playerTurn } </span>
          <br></br>
          <br></br>
          <span> your color: </span>
          <span id="colorInfo"> { myColor } </span>
          <br></br>
          <br></br>
          <span> turn number: </span>
          <span id="turnInfo"> { turn } </span>
          <p id="statusInfo" className="statusP"></p>
        </div>
      </div>
    </div>
  );
  
}

export default App;