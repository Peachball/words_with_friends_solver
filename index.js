const RACK_SIZE = 7;
const BOARD_SIZE = 11;
const WORD_LOCATION = "words.txt";

var trie = require('trie-prefix-tree');
var dict = trie();

document.addEventListener('DOMContentLoaded', function() {
	var app = new Vue({
		el: '#app',
		data: {
			board: function() {
				var tb = [];
				for (var i = 0; i < BOARD_SIZE; i++) {
					tb.push([]);
					for (var j = 0; j < BOARD_SIZE; j++) {
						tb[i].push("");
					}
				}
				return tb;
			}(),
			rack: function() {
				var r = [];
				for (var i = 0; i < RACK_SIZE; i++) {
					r.push("");
				}
				return r;
			}(),
			error: "",
			readOnlyMode: false
		},
		methods: {
			solve: function() {
				// Verify inputs
				for (var i = 0; i < RACK_SIZE; i++) {
					if (this.rack[i].length != 1) {
						alert("Invalid rack at position " + i.toString());
						return;
					}
					if (this.rack[i] === " ") {
						continue;
					}
					this.rack[i] = this.rack[i].toLowerCase();
					if (this.rack[i][0] > 'z' || this.rack[i][0] < 'a') {
						alert("Invalid rack at position " + i.toString());
						return;
						
					}
				}
				for (var r = 0; r < BOARD_SIZE; r++) {
					for (var c = 0; c < BOARD_SIZE; c++) {
						if (this.board[r][c].length > 1) {
							alert("Invalid board at position:"
								+ r.toString() + "," + c.toString());
							return;
						}
						if (this.board[r][c].length == 1) {
							this.board[r][c] = this.board[r][c].toLowerCase();
							if (this.board[r][c] > 'z' || this.board[r][c] < 'a') {
								alert("Invalid board at position:"
									+ r.toString() + "," + c.toString());
								return;
							}
						}
					}
				}
				// beginning of solving process
				this.readOnlyMode = true;
				var boardClone = JSON.parse(JSON.stringify(this.board));
				var rackClone = JSON.parse(JSON.stringify(this.rack));
				wordChecker(boardClone, rackClone);
			},
			clearSolve: function() {
				this.readOnlyMode = false;
			},
			reset: function() {
				this.readOnlyMode = false;
			},
		},
	});
});

function wordChecker(boardArray, tilesArray) {
	for (var r = 0 ; r < boardArray.length ; r++) {
		for (var c = 0 ; c < boardArray[0].length ; c++) {
			var possibility = possibilityChecker(r, c, boardArray);
			var possibleWords = [];
			if (possibility.horizontal) {
				buildAWordArray(r, c, boardArray, tilesArray, possibleWords,
					"h");
			}
			if (possibility.vertical) {
				buildAWordArray(r, c, boardArray, tilesArray, possibleWords,
					"v");
			}
			for (var i = 0 ; i < setOfWords.length ; i++) {
				if (words.check(setOfWords[i])) {
					console.log(setOfWords[i] + " is playable");
				}
			}
		}
	}
}

function possibilityChecker(r, c, boardArray) {
	var R = boardArray.length;
	var W = boardArray[0].length;
	var p = {horizontal: false, vertical: false};
	for (var dr = 0; dr + r < R && dr < 7; r++) {
		if (boardArray[r + dr][c] != '') {
			p.horizontal = true;
			break;
		}
	}
	for (var dc = 0; dc + c < W; c++) {
		if (boardArray[r][c + dc] != '') {
			p.vertical = true;
			break;
		}
	}
	return p;
}

function offBoardTileCheck(x , y) {
	if (y - 1 < 0) {
		return true;
	} else if (y + 1 > boardArray.length) {
		return true;
	} else if (x - 1 < 0) {
		return true;
	} else if (x + 1 > boardArray[0].length) {
		return true;
	}
}


function buildAWordArray(r, c, boardArray, tilesArray, possibleWords, direction) {
	// Takes a square
	// Puts letters in one direction away from it
	// Returns array
	if (direction === "h") {
		var restrictions = [0, 0, 0, 0, 0, 0, 0];
	}
	if (direction == "c") {
	}
}


function check(r, c, board, direction) {
	if (direction == 'h') {
		while (board[r][c] != '' && c >= 0) {
			c--;
		}
		c += board[r][c] == '';
		var w = "";
		while (board[r][c] != '') {
			w = w + board[r][c];
		}

	}
	if (direction == 'v') {
		while (board[r][c] != '' && r >= 0) {
			r--;
		}
	}
}

function _wordArrayHelper(r, c, word, board, tiles, dir) {
	if (dir == "h") {
		if (board[r][c] != "") {
			return _wordArrayHelper(r, c + 1, word + board[r][c], board, tiles, dir);
		}
	}
	if (dir == "c") {
	}
}
