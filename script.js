
//used to determine which combat function to run
let enemyDefeats = 0;



//player stats object
let player = {
	shipName: 'Player',
	currentHull: 20,
	maxHull: 20,
	firepower: 5,
	recharge: 0,
	accuracy: 0.7,
	speed: 1,
	money: 0,
};

//used to display the mystery enemies before each combat
const blankEnemy = {
	shipNAme: '???',
	currentHull: '???',
	maxHull: '???',
	firepower: '???',
	accuracy: '???',
	speed: '???',
	money: '???',
};

//enemy class that increases with difficult as you progress through the 6 enemies
const Aliens = function(name, level) {
	this.shipName = name;
	this.maxHull = Math.floor((Math.random() * 6) + (5 * level));
	this.currentHull = this.maxHull;
	this.firepower = (Math.floor((Math.random() * 4) + (2 * level))); 
	this.accuracy = ((Math.random()) + (0.1 * level)).toFixed(2);
	this.speed = ((Math.random() * level).toFixed(2)); 
	this.money = (Math.floor(Math.random() * 4) + (2 * level));
	this.recharge = 0;
}


//three upgrade objects for upgrade buying function
let upgradeCost = {
	firepower: 1,
	maxHull: 1,
	accuracy: 1,
	speed: 1,
	recharge: 1,
}

let upgradeLevel = {
	firepower: 0,
	maxHull: 0,
	accuracy: 0,
	speed: 0,
	recharge: 0,
};

let upgradeIncrement = {
	firepower: 2,
	maxHull: 5,
	accuracy: .05,
	speed: .25,
	recharge: 1,
};

//all of these are display linking variables for DOM manipulation
const playerShip = document.querySelector('.player-ship');


const playerNameDisplay = document.querySelector('#player-name');
const playerCurrentHullDisplay = document.querySelector('#player-current-hull');
const playerMaxHullDisplay = document.querySelector('#player-max-hull');
const playerFirepower = document.querySelector('#player-firepower');
const playerAccuracy = document.querySelector('#player-accuracy');
const playerSpeed = document.querySelector('#player-speed');
const playerMoney = document.querySelector('#player-money');
const playerRecharge = document.querySelector('#player-recharge');
const playerRechargeDisplaying = document.querySelector('#hidden-stat');


const combatLogs = document.querySelector('.logs');


const enemyShipBox = document.querySelector('.enemy-ship');
const enemyName = document.querySelector('#enemy-name');
const enemyCurrentHullDisplay = document.querySelector('#enemy-current-hull');
const enemyMaxHullDisplay = document.querySelector('#enemy-max-hull');
const enemyFirepower = document.querySelector('#enemy-firepower');
const enemyAccuracy = document.querySelector('#enemy-accuracy');
const enemySpeed = document.querySelector('#enemy-speed');
const enemyMoney = document.querySelector('#enemy-money');



const displayMessage = document.querySelector('.display-message');

const button1 = document.querySelector('.button1');
const button2 = document.querySelector('.button2');
const button3 = document.querySelector('.button3');
const button4 = document.querySelector('.button4');
const button5 = document.querySelector('.button5');
const button6 = document.querySelector('.button6');

//scroll to bottom code
const scrollToBottom = (node) => {
	node.scrollTop = node.scrollHeight;
};

//remove child nodes code for clearing out combat logs between each chunk of 1-6 fights
function removeChildren(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}



//the big attack function, does all the attack exchanges for 1 combat round 
function attack(attacker, defender) {
	const hitChance = Math.random().toFixed(2);
	//check if hit or not then:
	if (attacker.accuracy > hitChance) {
		//just to prevent negative numbers
		if (attacker.currentHull + attacker.recharge > attacker.maxHull) {
			attacker.currentHull = attacker.maxHull;
		} else {
			attacker.currentHull += attacker.recharge;
		}
		playerCurrentHullDisplay.innerText = player.currentHull;
		if ((defender.currentHull - attacker.firepower) < 0) {
			defender.currentHull = 0;
		} else {
			defender.currentHull -= attacker.firepower;
		}
		//updates the display hull value
		if (defender == player) {
			playerCurrentHullDisplay.innerText = player.currentHull;
		} else {
			enemyCurrentHullDisplay.innerText = defender.currentHull;
		}
		//display that a hit was made in the middle fight log
		let attackHit = `${attacker.shipName} hit ${defender.shipName} for ${attacker.firepower} damage`;
		const newLog = document.createElement('span');
		newLog.innerText = attackHit;
		combatLogs.appendChild(newLog);
		scrollToBottom(combatLogs);
		//start next attack with switched positions if defender survives hit
        if ((defender.currentHull > 0)) {
            setTimeout(function() {
                attack(defender, attacker, 2)
            }, 1000)
		//what happens if the defender dies	
        } else {
			//check if defender was player
			if (defender == player) {
				//losing text, button change
				enemyDefeats = 0;
				setTimeout(function () {
					updateButton(button1, 'Wake Up', '', 'defeat');
					displayMessage.innerText = 'The aliens blast you out of space';
				}, 1000);
			//if defender is enemy by default of previous check failing	
			} else {
				//final fight only
				if (enemyDefeats >= 5) {
					setTimeout(function () {
						displayMessage.innerText =
							"Congratulations captain. You have eliminated the alien threat! Would you like to reset the time line and play again?";
							updateButton(button1, 'Yes', '', 'restart-game');
							updateButton(button2, 'No thank you', '', 'end-game');
					}, 1000);
				} else {
					//winning text, button change, money get, money display update
					player.money += defender.money;
					playerMoney.innerText = player.money;
					defender.money = 0;
					enemyMoney.innerText = defender.money;
					enemyDefeats += 1;
					setTimeout(function () {
						updateButton(button1, 'Next Fight', '', 'intro3');
						updateButton(button2, 'Retreat to Base', '', 'retreat');
						displayMessage.innerText =
						"Congratulations captain. Would you like to move on to fight the next enemy or return to base and upgrade your weapon systems? Remember, if you return the mothership will restock on all ships you've already destroyed.";
					}, 1000);
				}
			}
		}
	} else {
		//display miss text
		let attackMiss = `${attacker.shipName} missed!`;
		const newLog = document.createElement('span');
		newLog.innerText = attackMiss;
		combatLogs.appendChild(newLog);
		scrollToBottom(combatLogs);
        if ((defender.currentHull > 0)) {
            setTimeout(function() {
                attack(defender, attacker, 2)
            }, 1000)
        }
	}
}


//basic attack turn function
function combat(enemy) {
	console.log(enemy);
	if (player.speed >= enemy.speed) {
		setTimeout(function () {
			attack(player, enemy);
		}, 1000);
	} else {
		setTimeout(function () {
			attack(enemy, player);
		}, 1000);
	}
}



//upgrade buying function, only works if can afford
//side not, note sure if theres a better way to do this other than the [type] notation
function buyUpgrade(type) {
	if (player.money >= upgradeCost[type]) {
		upgradeLevel[type] += 1;
		player[type] += upgradeIncrement[type];
		player.money -= upgradeCost[type];
		upgradeCost[type] *= 2;
		player.currentHull = player.maxHull;
		// player.speed = (player.speed).toFixed(1);
		//update all stats because its hard to get the integr
		playerFirepower.innerText = player.firepower;
		playerMaxHullDisplay.innerText = player.maxHull;
		playerCurrentHullDisplay.innerText = player.currentHull;
		playerAccuracy.innerText = player.accuracy;
		playerSpeed.innerText = player.speed;
		playerRecharge.innerText = player.recharge;
		playerMoney.innerText = player.money;
		playerRechargeDisplaying.style.display = '';
	}
}





function updateButton(buttonnum, innertext, display, newid) {
	buttonnum.style.display = display;
	buttonnum.innerText = innertext;
	buttonnum.id = newid;
}

function playerDisplay() {
	playerNameDisplay.innerText = player.shipName;
	playerCurrentHullDisplay.innerText = player.currentHull;
	playerMaxHullDisplay.innerText = player.maxHull;
	playerFirepower.innerText = player.firepower;
	playerAccuracy.innerText = player.accuracy;
	playerSpeed.innerText = player.speed;
	playerMoney.innerText = player.money;
	playerRecharge.innerText = player.recharge;
}

function newEnemyDisplay(enemy) {
	enemyName.innerText = enemy.shipName;
	enemyCurrentHullDisplay.innerText = enemy.currentHull;
	enemyMaxHullDisplay.innerText = enemy.maxHull;
	enemyFirepower.innerText = enemy.firepower;
	enemyAccuracy.innerText = enemy.accuracy;
	enemySpeed.innerText = enemy.speed;
	enemyMoney.innerText = enemy.money;
}

function mysteryEnemyDisplay() {
	enemyName.innerText = '???';
	enemyCurrentHullDisplay.innerText = '???';
	enemyMaxHullDisplay.innerText = '???';
	enemyFirepower.innerText = '???';
	enemyAccuracy.innerText = '???';
	enemySpeed.innerText = '???';
	enemyMoney.innerText = '???';
}

function newCombatLogChunk(order) {
	const newLog = document.createElement('span');
	newLog.style.color = "red";
	newLog.innerText = `The ${order} fight:`;
	combatLogs.appendChild(newLog);
}


function playGame(event) {
	if (event.target.id == 'dont-start') {
		updateButton(button1, 'Play Game', '', 'start-game');
		updateButton(button2, '', 'none', '');
		displayMessage.innerText =
			'You have no choice in the matter. \r\n You will play.';
	} else if (event.target.id == 'start-game') {
		displayMessage.innerText = `You are the earth's last defense against an alien invasion.`;
		updateButton(button1, 'Continue', '', 'intro1');
		updateButton(button2, '', 'none', '');
		playerShip.style.display = "flex";
		playerDisplay();
	} else if (event.target.id == 'intro1') {
		displayMessage.innerText =
			'If you can manage to defeat 5 underlings in a row and the mothership following the threat will be neutralized.';
		updateButton(button1, 'Continue', '', 'intro2');
	} else if (event.target.id == 'intro2') {
		displayMessage.innerText = 'The first enemy approaches.';
		updateButton(button1, 'Fight!', '', 'fight1');
		updateButton(button2, '', 'none', '');
		updateButton(button3, '', 'none', '');
		updateButton(button4, '', 'none', '');
		updateButton(button5, '', 'none', '');
		updateButton(button6, '', 'none', '');
		enemyShipBox.style.display = 'flex';
		mysteryEnemyDisplay();
	} else if (event.target.id == 'fight1') {
		//start first fight
		let alien1 = new Aliens('Mite', 1);
		newEnemyDisplay(alien1);
		combat(alien1);
		newCombatLogChunk('first');
		updateButton(button1, '', 'none', '');
		displayMessage.innerText = 'We wish you luck captain.';
	} else if (event.target.id == 'fight2') {
		//start second fight
		let alien2 = new Aliens('Swarmling', 2);
		newEnemyDisplay(alien2);
		combat(alien2);
		newCombatLogChunk('second');
		updateButton(button1, '', 'none', '');
		displayMessage.innerText = 'We wish you luck captain.';
	} else if (event.target.id == 'fight3') {
		//start third fight
		let alien3 = new Aliens('Swarmling', 3);
		newEnemyDisplay(alien3);
		combat(alien3);
		newCombatLogChunk('third');
		updateButton(button1, '', 'none', '');
		displayMessage.innerText = 'We wish you luck captain.';
	} else if (event.target.id == 'fight4') {
		//start fourth fight
		let alien4 = new Aliens('Swarmling Elite', 4);
		newEnemyDisplay(alien4);
		combat(alien4);
		newCombatLogChunk('fourth');
		updateButton(button1, '', 'none', '');
		displayMessage.innerText = 'We wish you luck captain.';
	} else if (event.target.id == 'fight5') {
		//start fifth fight
		let alien5 = new Aliens('Soldier', 5);
		newEnemyDisplay(alien5);
		combat(alien5);
		newCombatLogChunk('fifth');
		updateButton(button1, '', 'none', '');
		displayMessage.innerText = 'We wish you luck captain.';
	} else if (event.target.id == 'fight6') {
		//start final fight
		let alien6 = new Aliens('Mothership', 10);
		newEnemyDisplay(alien6);
		combat(alien6);
		newCombatLogChunk('final');
		updateButton(button1, '', 'none', '');
		displayMessage.innerText = 'We wish you luck captain.';
	} else if (event.target.id == 'retreat') {
		//return to base + change buttons to shop + regen health
		removeChildren(combatLogs);
		enemyDefeats = 0;
		player.currentHull = player.maxHull;
		playerCurrentHullDisplay.innerText = player.currentHull;
		updateButton(button1, 'firepower+', '', 'attack-increase');
		updateButton(button2, 'maxhull+', '', 'hull-increase');
		updateButton(button3, 'accuracy+', '', 'accuracy-increase');
		updateButton(button4, 'speed+', '', 'speed-increase');
		updateButton(button5, 'Damage Recharge', '', 'recharge-increase');
		updateButton(button6, 'return to fight', '', 'intro2');
		enemyShipBox.style.display = 'none';
		displayMessage.innerText = 'Welcome to the galactic base. we\'ve taken the liberty of repairing your ships hull. Below in our galactic shop you will find an array of upgrades for your ship. The aliens signal has scrambled our pricing display, but everything starts at 1 money and doubles in price with each purchase.';
		//the upgrade buying executions
	} else if (event.target.id == 'attack-increase') {
		buyUpgrade('firepower');
	} else if (event.target.id == 'hull-increase') {
		buyUpgrade('maxHull');
	} else if (event.target.id == 'accuracy-increase') {
		buyUpgrade('accuracy');
	} else if (event.target.id == 'speed-increase') {
		buyUpgrade('speed');
	} else if (event.target.id == 'recharge-increase') {
		buyUpgrade('recharge');
		//Next enemy after a successful kill
	} else if (event.target.id == 'intro3') {
		if (enemyDefeats == 1) {
			updateButton(button1, 'Fight!', '', 'fight2');
			updateButton(button2, '', 'none', '');
			displayMessage.innerText = 'The next enemy approaches.';
			mysteryEnemyDisplay();
		} else if (enemyDefeats == 2) {
			updateButton(button1, 'Fight!', '', 'fight3');
			updateButton(button2, '', 'none', '');
			displayMessage.innerText = 'The next enemy approaches.';
			mysteryEnemyDisplay();
		} else if (enemyDefeats == 3) {
			updateButton(button1, 'Fight!', '', 'fight4');
			updateButton(button2, '', 'none', '');
			displayMessage.innerText = 'The next enemy approaches.';
			mysteryEnemyDisplay();
		} else if (enemyDefeats == 4) {
			updateButton(button1, 'Fight!', '', 'fight5');
			updateButton(button2, '', 'none', '');
			displayMessage.innerText = 'The next enemy approaches.';
			mysteryEnemyDisplay();
		} else if (enemyDefeats == 5) {
			updateButton(button1, 'Fight!', '', 'fight6');
			updateButton(button2, '', 'none', '');
			displayMessage.innerText = 'The Mothership awaits.';
			mysteryEnemyDisplay();
		}
	} else if (event.target.id == 'defeat') {
		removeChildren(combatLogs);
		enemyDefeats == 0;
		player.currentHull = player.maxHull;
		playerCurrentHullDisplay.innerText = player.currentHull;
		updateButton(button1, 'firepower+', '', 'attack-increase');
		updateButton(button2, 'maxhull+', '', 'hull-increase');
		updateButton(button3, 'accuracy+', '', 'accuracy-increase');
		updateButton(button4, 'speed+', '', 'speed-increase');
		updateButton(button5, 'Damage Recharge', '', 'recharge');
		updateButton(button6, 'return to fight', '', 'intro2');
		enemyShipBox.style.display = 'none';
		displayMessage.innerText =
			'You wake up back at the galactic base. Perhaps you should rest and look for some upgrades to help you on your mission. Each upgrade starts at 1 money and doubles in price with each purchase.';
	} else if (event.target.id == 'end-game') {

	} else if (event.target.id == 'restart-game') {
		//restart game and reset all stats
		removeChildren(combatLogs);
		displayMessage.innerText = `You are (once again) the earth's last defense against an alien invasion.`;
		updateButton(button1, 'Continue', '', 'intro1');
		updateButton(button2, '', 'none', '');
		player.firepower = 5;
		player.currentHull = 20;
		player.maxHull = 20;
		player.accuracy = 0.7;
		player.recharge = 0;
		player.speed = 1;
		player.money = 0;
		enemyDefeats = 0;
		upgradeCost.firepower = 1;
		upgradeCost.maxHull = 1;
		upgradeCost.accuracy = 1;
		upgradeCost.speed = 1;
		upgradeCost.recharge = 1;
		upgradeLevel.firepower = 0;
		upgradeLevel.maxHull = 0;
		upgradeLevel.accuracy = 0;
		upgradeLevel.speed = 0;
		upgradeLevel.recharge = 0;
		playerDisplay();
	}
}


const choices = document.querySelector(".choices-area");

choices.addEventListener("click", playGame);



//