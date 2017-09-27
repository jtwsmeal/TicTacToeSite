app.controller("TicTacToeController", ["$scope", function($scope) {
	// 0 = untouched.
	// 1 = player.
	// 2 = computer.
	$scope.gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]
	$scope.playerMove = function(number) {
		makeMove(number, "player");
	}

	function computerMove() {
		var number = Math.floor(Math.random() * 9);
		makeMove(number, "computer");
	}

	function makeMove(number, who) {
		if ($scope.gameBoard[number] === 0) {
			var id = "cell" + number;
			if (who === "player") {
				$scope.gameBoard[number] = 1;

				// The following line had to be replaced with the line after it, due to an unknown error.
				// angular.element(id).css('background-color', 'green');
				document.getElementById(id).style.backgroundColor = "green";

			} else {  // who === "computer"
				$scope.gameBoard[number] = 2;

				// The following line had to be replaced with the line after it, due to an unknown error.
				// angular.element(id).css('background-color', 'blue');
				document.getElementById(id).style.backgroundColor = "blue";
			}

			checkWinner();
			if (who === "player") {
				computerMove();
			}

		} else {
			if (who === "player") {
				// The player picked a spot that the computer has claimed already.
				alert("Invalid move!");
			} else {  // who === "computer"
				computerMove();
			}
		}
	}

	// Checks for whether there is a winner, a tie, or the game should keep going.
	function checkWinner() {
		var winner = "";

		/* Checking for winners starts. */

		// Checking columns for a winner.
		if (($scope.gameBoard[0] === $scope.gameBoard[3] && $scope.gameBoard[3] === $scope.gameBoard[6]) && $scope.gameBoard[0] !== 0) {
			winner = ($scope.gameBoard[0] === 1) ? ('player') : ('computer');
		}

		if (($scope.gameBoard[1] === $scope.gameBoard[4] && $scope.gameBoard[4] === $scope.gameBoard[7]) && $scope.gameBoard[1] !== 0) {
			winner = ($scope.gameBoard[1] === 1) ? ('player') : ('computer');
		}

		if (($scope.gameBoard[2] === $scope.gameBoard[5] && $scope.gameBoard[5] === $scope.gameBoard[8]) && $scope.gameBoard[2] !== 0) {
			winner = ($scope.gameBoard[2] === 1) ? ('player') : ('computer');
		}

		// Checking rows for a winner.
		if (($scope.gameBoard[0] === $scope.gameBoard[1] && $scope.gameBoard[1] === $scope.gameBoard[2]) && $scope.gameBoard[0] !== 0) {
			winner = ($scope.gameBoard[0] === 1) ? ('player') : ('computer');
		}

		if (($scope.gameBoard[3] === $scope.gameBoard[4] && $scope.gameBoard[4] === $scope.gameBoard[5]) && $scope.gameBoard[3] !== 0) {
			winner = ($scope.gameBoard[3] === 1) ? ('player') : ('computer');
		}

		if (($scope.gameBoard[6] === $scope.gameBoard[7] && $scope.gameBoard[7] === $scope.gameBoard[8]) && $scope.gameBoard[6] !== 0) {
			winner = ($scope.gameBoard[6] === 1) ? ('player') : ('computer');
		}

		// Checking diagonals for a winner.
		if (($scope.gameBoard[0] === $scope.gameBoard[4] && $scope.gameBoard[4] === $scope.gameBoard[8]) && $scope.gameBoard[0] !== 0) {
			winner = ($scope.gameBoard[0] === 1) ? ('player') : ('computer');
		}

		if (($scope.gameBoard[2] === $scope.gameBoard[4] && $scope.gameBoard[4] === $scope.gameBoard[6]) && $scope.gameBoard[2] !== 0) {
			winner = ($scope.gameBoard[2] === 1) ? ('player') : ('computer');
		}

		/* Checking for winners ends. */

		if (winner === "") {
			// No winner yet.

			// Finds the number of unchosen squares.
			var numberOfZeroes = findUntouchedSquares();

			if (numberOfZeroes === 0) {
				// All spaces have been chosen, and there is a tie.
				finishGame("Tie game.  Play again?");
			} else {
				// No winner yet.
				return;
			}
		} else {
			// There is a winner.
			finishGame("Winner :  " + winner + ".  Play again?");
		}
	}

	// Finds the number of unchosen squares.
	function findUntouchedSquares() {
		var numberOfZeroes = 0;

		for (var i = 0; i < $scope.gameBoard.length; i++) {
			if ($scope.gameBoard[i] === 0) {
				numberOfZeroes++;
			}
		}

		return numberOfZeroes;
	}

	// Reloads the page or closes the tab.
	function finishGame(message) {
		if (confirm(message)) {
		    location.reload();
		} else {
		    window.close();
		}
	}

}]);