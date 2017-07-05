const RACK_SIZE = 7;
const BOARD_SIZE = 11;
const WORD_LOCATION = "words.txt";

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
			readOnlyMode: false,
			wordlist: function() {
				var output = "hi";
				$.get({
					url: 'words.txt',
					success: function(data) {
						output = data;
					},
					async: false
				});
				return output;
			}()
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
				wordChecker(this.wordlist, this.board);
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




function checkIfWordExists(word, wordArray) {
	var l = 0, h = wordArray.length - 1;
	while (l <= h) {
		var m = (h + l) / 2;
		var tempWord = wordArray[m];
		if (tempWord === word) {
			return true;
		}
		else if (tempWord < word) {
			l = m + 1;
		}
		else {
			h = m - 1;
		}
	}
	return false;
}




function wordChecker(wordArray , boardArray) {
	for (var y = 0 ; y < boardArray.length ; y++) {
		for (var x = 0 ; x < boardArray[0].length ; x++) {
			var square = boardArray[y][x];
			var possibility = possibilityChecker(square , x , y);
			console.log(possibility);
		}
	}
};

function possibilityChecker(square , x , y) {
	var adjacentSquares = [boardArray[y - 1][x] , boardArray[y + 1][x] , boardArray[y][x - 1] , boardArray[y][x + 1]];
	if (y - 1 < 0) {
		adjacentSquares[0] = "";
	} else if (y + 1 > boardArray.length) {
		adjacentSquares[1] = "";
	} else if (x - 1 < 0) {
		adjacentSquares[2] = "";
	} else if (x + 1 > boardArray[0].length) {
		adjacentSquares[3] = "";
	}
	for (var i = 0 ; i < adjacentSquares.length ; i++) {
		if (adjacentSquares[i] !== "") {
			return true;
		}
	}
	return false;
};

function buildAWordArray() {
};
