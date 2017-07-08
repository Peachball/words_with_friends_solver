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
				wordChecker(this.wordlist, this.board, this.rack);
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




function wordChecker(wordArray , boardArray , tilesArray) {
	for (var y = 0 ; y < boardArray.length ; y++) {
		for (var x = 0 ; x < boardArray[0].length ; x++) {
			var square = {
				value : boardArray[y][x],
				x : x,
				y : y
			};
			var possibility = possibilityChecker(square , boardArray);
			if (possibility == true) {
				var setOfWords = buildAWordArray(square , boardArray , tilesArray);
			}
			for (var i = 0 ; i < setOfWords.length ; i++) {
				if (checkIfWordExists(setOfWords[i] , wordArray)) {
					console.log(setOfWords[i] + " is playable");
				}
			}
		}
	}
};

function possibilityChecker(square , boardArray) {
	var dx = [-1, 0, 0, 1];
	var dy = [0, -1, 1, 0];
	var possible = false;
	for (var i = 0; i < 4; i++) {
		var newX = square.x + dx[i];
		var newY = square.y + dy[i];
		if (!(newX < 0 || newX >= boardArray[0].length || newY < 0 ||
		newY >= boardArray.length) && boardArray[newY][newX] !== "") {
			return true;
		}
	}
	return false;
};

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
};

function buildAWordArray(square , boardArray , tilesArray) {
	// Takes a square
	// Puts letters in one direction away from it
	// Returns array
};
