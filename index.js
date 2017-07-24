const RACK_SIZE = 7;
const BOARD_SIZE = 11;
const WORD_LOCATION = "words.txt";

var trie = require('trie-prefix-tree');
var dict = null;

(function() {
	$.get({
		url: 'words.txt',
		success: function(data) {
			dict = trie(data.split('\n'));
		},
		async: true
	});
})();

$(document).ready(function(){
	$(".sqr, .rack").change(function(e){
		console.log(this.value);
		this.value = this.value.toUpperCase();
	});
});

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
				tb[5][5] = 'a';
				tb[5][6] = 's';
				return tb;
			}(),
			rack: function() {
				var r = [];
				for (var i = 0; i < RACK_SIZE; i++) {
					r.push("");
				}
				r = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
				return r;
			}(),
			error: "",
			readOnlyMode: false,
			status: ""
		},
		methods: {
			solve: function() {
				if (dict == null) {
					alert("Dict not done loading yet...");
				}
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
			var word = [];
			if (possibility.horizontal) {
				buildAWordArray(r, c, boardArray, tilesArray, word,
					"h");
			}
			if (possibility.vertical) {
				buildAWordArray(r, c, boardArray, tilesArray, word,
					"v");
			}
		}
	}
}

function possibilityChecker(r, c, boardArray) {
	var R = boardArray.length;
	var W = boardArray[0].length;
	var p = {horizontal: false, vertical: false};
	for (var dr = 0; dr + r < R && dr < 7; dr++) {
		if (boardArray[r + dr][c] != '') {
			p.horizontal = true;
			break;
		}
	}
	for (var dc = 0; dc + c < W; dc++) {
		if (boardArray[r][c + dc] != '') {
			p.vertical = true;
			break;
		}
	}
	return p;
}

function inBounds(c, r, board) {
	if (r < 0) {
		return false;
	} else if (r >= board.length) {
		return false;
	} else if (c < 0) {
		return false;
	} else if (c >= board[0].length) {
		return false;
	}
	return true;
}


function buildAWordArray(r, c, board, tiles, curWord, dir, touched) {
	// Takes a square
	// Puts letters in one direction away from it
	// Returns array
	if (touched) {
		checkPlay(r, c, board, dir);
	}
	if (tiles.length == 0) {
		return;
	}
	if (!dict.isPrefix(curWord.join(""))) {
		return;
	}
	var dr = [1, 0],
		dc = [0, 1];
	if (dir == "h") {
		dr.push(-1);
		dc.push(0);
	}
	if (dir == "v") {
		dr.push(0);
		dc.push(-1);
	}
	for (var i = 0; i < dr.length; i++) {
		var nr = dr[i] + r,
			nc = dc[i] + c;
		if (!inBounds(nr, nc, board)) {
			continue;
		}
		if (board[nr][nc] != "") {
			touched = true;
			break;
		}
	}
	for (var i = 0; i < tiles.length; i++) {
		var char = tiles[i];
		board[r][c] = char
		tiles.splice(i, 1);
		curWord.push(char);
		if (dir == 'h') {
			buildAWordArray(r, c+1, board, tiles, curWord, dir, touched);
		}
		else {
			buildAWordArray(r+1, c, board, tiles, curWord, dir, touched);
		}
		curWord.pop();
		tiles.splice(i, 0, c);
	}
}


/*
 * Checks if the word under curosr is a legitimate play
 */
function checkPlay(r, c, board, dir) {
	if (dir == 'h') {
		while (c >= 0 && board[r][c] != '') {
			c--;
		}
		c += board[r][c] == '';
		if (!checkWord(r, c, board, dir)) { // Check if played word is legit
			return false;
		}
		while (board[r][c] != '') {
			// Check above and below
			if (r > 0) {
				if (board[r - 1][c] != '') {
					if (!checkWord(r - 1, c, board, 'v')) {
						return false;
					}
				}
			}
			if (r + 1 < board.length) {
				if (board[r + 1][c] != '') {
					if (!checkWord(r + 1, c, board, 'v')) {
						return false;
					}
				}
			}
		}
		var w = '';
		while (c < board[0].length && board[r][c] != "") {
			w = w + board[r][c];
		}
		console.log(w);
		return true;
	}
	if (dir == 'v') {
		while (board[r][c] != '' && r >= 0) {
			r--;
		}
		r += board[r][c] == '';
		while (board[r][c] != '') {
			// Check left and right
			if (c > 0) {
				if (board[r][c - 1] != '') {
					if (!checkWord(r, c - 1, board, 'h')) {
						return false;
					}
				}
			}
			if (c + 1 < board[0].length) {
				if (board[r][c + 1] != '') {
					if (!checkWord(r, c + 1, board, 'h')) {
						return false;
					}
				}
			}
		}
		var w = '';
		while (c < board[0].length && board[r][c] != "") {
			w = w + board[r][c];
		}
		console.log(w);
		return true;
	}
}

/*
 * Checks if the word at the position in the direction is viable
 */
function checkWord(r, c, board, dir) {
	if (dir == 'h') { // Horizontal
		while (c >= 0 && board[r][c] != '') {
			c--;
		}
		c += board[r][c] == '';
		var word = "";
		while (c < board[0].length && board[r][c] != "") {
			word = word + board[r][c];
			if (dict.isPrefix(word)) {
				return false;
			}
			c++;
		}
		return true;
	}
	if (dir == 'v') { // Vertical
		while (r >= 0 && board[r][c] != '') {
			r--;
		}
		r += board[r][c] == '';
		var word = "";
		while (r < board.length && board[r][c] != "") {
			word = word + board[r][c];
			if (dict.isPrefix(word)) {
				return false;
			}
			r++;
		}
		return true;
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
