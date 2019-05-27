import React from 'react';
import PropTypes from 'prop-types';
import { Panel, ListItem, Button, Group, Div, Avatar, PanelHeader } from '@vkontakte/vkui';
import axios from 'axios';

var a = null;
const FIT_ATTEMPTS = 2;
const EMPTYCHAR = ' ';
let wordArray = [];

class board {
	constructor(cols1, rows1) {
		this.cols = cols1;
		this.rows = rows1;
		this.activeWordList = []; //keeps array of words actually placed in board
		this.acrossCount = 0;
		this.downCount = 0;
		this.GRID_HEIGHT = cols1;
		this.GRID_WIDTH = rows1;
		this.coordList = [];
		this.grid = new Array(this.cols); //create 2 dimensional array for letter grid
		for (var i = 0; i < this.rows; i++) {
			this.grid[i] = new Array(this.rows);
		}
	}
	// (cols1, rows1) { //instantiator object for making gameboards
	moveMatX = (step) => {
		for (let sx = 0; sx < step; sx++) {
			this.grid.unshift(this.grid.pop());
		}
		if (this.acrossCount != 0) {
			for (let i = 0; i < this.activeWordList.length; i++) {
				this.activeWordList[i].x += step;
			}
		}
	}

	moveMatY = (step) => {
		for (let x = 0; x < 15; x++) {
			for (let y = 0; y < step; y++) {
				this.grid[x].unshift(this.grid[x].pop());
			}
		}
	}

	suggestCoords(word) { //search for potential cross placement locations
		var c = '';
		this.coordList = [];
		var coordList = [];
		var coordCount = 0;
		for (var i = 0; i < word.length; i++) { //cycle through each character of the word
			for (var x = 0; x < this.GRID_HEIGHT; x++) {
				for (var y = 0; y < this.GRID_WIDTH; y++) {
					c = word[i];
					if (this.grid[x][y].targetChar == c) { //check for letter match in cell
						if (x - i + 1 > 0 && x - i + word.length - 1 < this.GRID_HEIGHT) { //would fit vertically?
							coordList[coordCount] = {};
							coordList[coordCount].w = word;
							coordList[coordCount].c = c;
							coordList[coordCount].x = x - i;
							coordList[coordCount].y = y;
							coordList[coordCount].score = 0;
							coordList[coordCount].vertical = true;
							if (x - i < 0) { coordList[coordCount].step = i; } else { coordList[coordCount].step = 0; }
							coordCount++;
						}

						if (y - i + 1 > 0 && y - i + word.length - 1 < this.GRID_WIDTH) { //would fit horizontally?
							coordList[coordCount] = {};
							coordList[coordCount].w = word;
							coordList[coordCount].c = c;
							coordList[coordCount].x = x;
							coordList[coordCount].y = y - i;
							coordList[coordCount].score = 0;
							coordList[coordCount].vertical = false;
							if (y - i < 0) { coordList[coordCount].step = i; } else { coordList[coordCount].step = 0; }

							coordCount++;
						}
					}
				}
			}
		}
		this.coordList = coordList;
	}

	checkFitScore(word, x, y, vertical) {
		var fitScore = 1; //default is 1, 2+ has crosses, 0 is invalid due to collision

		if (vertical) { //vertical checking
			for (var i = 0; i < word.length; i++) {
				if (this.grid[x + word.length - 1][y].targetChar != EMPTYCHAR) {
					fitScore = 0;
					break;
				}
				if (i == 0 && x > 0) { //check for empty space preceeding first character of word if not on edge
					if (this.grid[x - 1][y].targetChar != EMPTYCHAR) { //adjacent letter collision
						fitScore = 0;
						break;
					}
				} else if (i == word.length && x < this.GRID_HEIGHT) { //check for empty space after last character of word if not on edge
					if (this.grid[x + i + 1][y].targetChar != EMPTYCHAR) { //adjacent letter collision
						fitScore = 0;
						break;
					}
				}
				if (x + i < this.GRID_HEIGHT) {
					if (this.grid[x + i][y].targetChar == word[i]) { //letter match - aka cross point
						fitScore += 1;
					} else if (this.grid[x + i][y].targetChar != EMPTYCHAR) { //letter doesn't match and it isn't empty so there is a collision
						fitScore = 0;
						break;
					} else { //verify that there aren't letters on either side of placement if it isn't a crosspoint
						if (y < this.GRID_WIDTH - 1) { //check right side if it isn't on the edge
							if (this.grid[x + i][y + 1].targetChar != EMPTYCHAR) { //adjacent letter collision
								fitScore = 0;
								break;
							}
						}
						if (y > 0) { //check left side if it isn't on the edge
							if (this.grid[x + i][y - 1].targetChar != EMPTYCHAR) { //adjacent letter collision
								fitScore = 0;
								break;
							}
						}
					}
				}

			}

		} else { //horizontal checking
			for (i = 0; i < word.length; i++) {
				if (this.grid[x][y + word.length - 1].targetChar != EMPTYCHAR) {
					fitScore = 0;
					break;
				}
				if (i == 0 && y > 0) { //check for empty space preceeding first character of word if not on edge
					if (this.grid[x][y - 1].targetChar != this.EMPTYCHAR) { //adjacent letter collision
						fitScore = 0;
						break;
					}
				} else if (i == word.length - 1 && y + i < this.GRID_WIDTH - 1) { //check for empty space after last character of word if not on edge
					if (this.grid[x][y + i + 1].targetChar != this.EMPTYCHAR) { //adjacent letter collision
						fitScore = 0;
						break;
					}
				}
				if (y + i < this.GRID_WIDTH) {
					if (this.grid[x][y + i].targetChar == word[i]) { //letter match - aka cross point
						fitScore += 1;
					} else if (this.grid[x][y + i].targetChar != this.EMPTYCHAR) { //letter doesn't match and it isn't empty so there is a collision
						fitScore = 0;
						break;
					} else { //verify that there aren't letters on either side of placement if it isn't a crosspoint
						if (x < this.GRID_HEIGHT) { //check top side if it isn't on the edge
							if (this.grid[x + 1][y + i].targetChar != this.EMPTYCHAR) { //adjacent letter collision
								fitScore = 0;
								break;
							}
						}
						if (x > 0) { //check bottom side if it isn't on the edge
							if (this.grid[x - 1][y + i].targetChar != this.EMPTYCHAR) { //adjacent letter collision
								fitScore = 0;
								break;
							}
						}
					}
				}

			}
		}

		return fitScore;
	}

	placeWord(word, clue, x, y, vertical) { //places a new active word on the board

		var wordPlaced = false;
		// console.log("vertical ", vertical);
		if (vertical) {
			// console.log("vertical x ", word);
			if (word.length + x < this.GRID_HEIGHT) {
				for (var i = 0; i < word.length; i++) {
					this.grid[x + i][y].targetChar = word[i];
				}
				wordPlaced = true;
			}
		} else {
			// console.log("vertical y ", word);
			if (word.length + y < this.GRID_WIDTH) {
				for (var i = 0; i < word.length; i++) {
					this.grid[x][y + i].targetChar = word[i];
				}
				wordPlaced = true;
			}
		}

		if (wordPlaced) {
			var currentIndex = this.activeWordList.length;
			this.activeWordList[currentIndex] = {};
			this.activeWordList[currentIndex].word = word;
			this.activeWordList[currentIndex].clue = clue;
			this.activeWordList[currentIndex].x = x;
			this.activeWordList[currentIndex].y = y;
			this.activeWordList[currentIndex].vertical = vertical;

			if (this.activeWordList[currentIndex].vertical) {
				this.downCount++;
				this.activeWordList[currentIndex].number = this.downCount;
			} else {
				this.acrossCount++;
				this.activeWordList[currentIndex].number = this.acrossCount;
			}
		}

	}

	isActiveWord(word) {
		if (this.activeWordList.length > 0) {
			for (var w = 0; w < this.activeWordList.length; w++) {
				if (word == this.activeWordList[w].word) {
					//console.log(word + ' in activeWordList');
					return true;
				}
			}
		}
		return false;
	}

	displayGrid = () => {

		// var rowStr = "";
		// for (var x = 0; x < cols; x++) {

		// 	for (var y = 0; y < rows; y++) {
		// 		rowStr += "<td>" + grid[x][y].targetChar + "</td>";
		// 	}
		// 	$('#tempTable').append("<tr>" + rowStr + "</tr>");
		// 	rowStr = "";

		// }
		let a = new Array(this.cols);
		for (let i = 0; i < a.length; i++) {
			a[i] = new Array(this.rows);
		}
		for (let x = 0; x < this.grid.length; x++) {
			for (let y = 0; y < this.grid[x].length; y++) {
				a[x][y] = this.grid[x][y].targetChar;
			}
		}
		console.log('grid ', a);
		console.log('across ', this.acrossCount);
		console.log('down ', this.downCount);
	}

	shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	//for each word in the source array we test where it can fit on the board and then test those locations for validity against other already placed words
	generateBoard = (seed = 0) => {

		var bestScoreIndex = 0;
		var top = 0;
		var fitScore = 0;
		var startTime;
		//manually place the longest word horizontally at 0,0, try others if the generated board is too weak
		// this.activeWordList = []; //keeps array of words actually placed in board
		// this.acrossCount = 0;
		// this.downCount = 0;

		for (var x = 0; x < this.cols; x++) {
			for (var y = 0; y < this.rows; y++) {
				this.grid[x][y] = {};
				this.grid[x][y].targetChar = EMPTYCHAR; //target character, hidden
				this.grid[x][y].indexDisplay = ''; //used to display index number of word start
				this.grid[x][y].value = '-'; //actual current letter shown on board
			}
		}

		this.placeWord(wordArray[seed].word, wordArray[seed].clue, 4, 2, false);


		//attempt to fill the rest of the board 
		for (var iy = 0; iy < 10; iy++) { //usually 2 times is enough for max fill potential
			for (var ix = seed + 1; ix < wordArray.length; ix++) {
				if (!this.isActiveWord(wordArray[ix].word)) { //only add if not already in the active word list
					var topScore = 0;
					bestScoreIndex = 0;
					this.suggestCoords(wordArray[ix].word); //fills coordList and coordCount
					// this.coordList = this.shuffle(this.coordList); //adds some randomization
					this.coordList.sort(() => { return Math.random() - 0.5 });

					if (this.coordList[0]) {
						for (var c = 0; c < this.coordList.length; c++) { //get the best fit score from the list of possible valid coordinates
							fitScore = this.checkFitScore(wordArray[ix].word, this.coordList[c].x, this.coordList[c].y, this.coordList[c].vertical);
							// console.log("fitScore ", fitScore)
							if (fitScore > topScore) {
								topScore = fitScore;
								bestScoreIndex = c;
							}
						}
					}

					if (topScore > 1) { //only place a word if it has a fitscore of 2 or higher
						// console.log("topScore ", topScore)
						// console.log("coordList[x] ", this.coordList[bestScoreIndex])
						this.placeWord(wordArray[ix].word, wordArray[ix].clue, this.coordList[bestScoreIndex].x, this.coordList[bestScoreIndex].y, this.coordList[bestScoreIndex].vertical);
					}
				}

			}
		}
		// this.moveMatX(3);
		if (this.activeWordList.length < wordArray.length / 3) { //regenerate board if if less than half the words were placed
			seed++;
			this.generateBoard(seed);
		}
	}
}


let getCrossword = () => {
	// console.log(props)
	////////////////////////////////////////////////////////
	// axios											  //
	// 	.get('https://app3.vk-irs.ru/backend/test.php', { //
	// 		params: {									  //
	// 		},											  //
	// 	})												  //
	// 	.then(function (response) {						  //
	// 		wordArray = response.data;					  //
	// 		console.log(wordArray);						  //
	// 		var gameboard = new board(10, 10);			  //
	// 		gameboard.generateBoard();					  //
	// 		console.log(gameboard);						  //
	// 		gameboard.displayGrid();					  //
	// 	});												  //
	////////////////////////////////////////////////////////
}

const Home = ({ id, go, fetchedUser, goForward }) => (
	<Panel id={id}>
		<PanelHeader>Example</PanelHeader>
		{fetchedUser &&
			<Group title="User Data Fetched with VK Connect">
				<ListItem
					before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} /> : null}
					description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
				>
					{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
				</ListItem>
			</Group>}

		<Group title="Navigation Example">
			<Div>
				<Button size="xl" level="2" onClick={() => { goForward("persik") }} data-to="persik">
					Show me the Persik, please
				</Button>
				<Button size="xl" level="2" onClick={getCrossword}>
					Console Crossword
				</Button>
				<Button size="xl" level="2" onClick={() => { goForward("main") }}>
					Main
				</Button>
			</Div>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
