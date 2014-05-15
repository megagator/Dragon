//The Knight
var knight = {
	health: 100, //must match the reset in beginGame()
	totalAttack: 0,
	rollCount: 0,
	prevRoll: 0,
	prev2Roll: 0
};

//Add a health indicator
var node = document.createElement("p");
node.id = "knight-health";
var textnode = document.createTextNode("Health: " + knight.health);
node.appendChild(textnode);
var firstChildRef = document.getElementById("knight").firstChild;
document.getElementById("knight").insertBefore(node, firstChildRef);

//The Dragon
var dragon = {
	health: 100, //must match the reset in beginGame()
	totalAttack: 0,
	prevRoll: 0
};

//Add a health indicator
var node = document.createElement("p");
node.id = "dragon-health";
var textnode = document.createTextNode("Health: " + dragon.health);
node.appendChild(textnode);
var firstChildRef = document.getElementById("dragon").firstChild;
document.getElementById("dragon").insertBefore(node, firstChildRef);

function disableAttack() {
	var roll = document.getElementById("roll-dice");
	roll.disabled = true;
	roll.className = "inactive";
	var attack = document.getElementById("attack"); 
	attack.disabled = true;
	attack.className = "inactive";
}

function enableAttack() {
	var roll = document.getElementById("roll-dice");
	roll.disabled = false;
	roll.className = false;
	var attack = document.getElementById("attack"); 
	attack.disabled = false;
	attack.className = false;
}

function deleteDice() {
		var elements = document.getElementsByClassName("dice");
		for(var i = 0; i < elements.length; i++){
			elements[i].style.opacity = 0;
		}
		
		setTimeout(function() {
			while(elements.length > 0){
				elements[0].parentNode.removeChild(elements[0]); 
			}
		}, 2000);
}

function notify(notification,color) {
	//create the notification paragragh
	var node = document.createElement("div");
	node.className = "fadeIn " + color;
	var textnode = document.createTextNode(notification);
	node.appendChild(textnode);
	document.getElementById("notifier").appendChild(node);
	
	function removeNote() {
		//delete all created notification paragraph	
		var elements = document.getElementsByClassName("fadeIn");
		
		while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
		}
	}
	//wait for animation to complete
	setTimeout(removeNote, 2300);
}

function endGame(status) {
	//add blur on the rest
	var blur = document.getElementById("blur");
	blur.style.webkitFilter = "blur(7px)";	
	
	//message
	setTimeout( function() { 
		//show ending dialog
		var end = document.getElementById("end");
		end.style.display = "block";
		end.style.opacity = 1;

		if (status === "won") {	
			end.firstElementChild.innerHTML = "Congratulations,</br>you conquered the dragon!";
		} else {
			end.firstElementChild.innerHTML = "You were defeated by the dragon.";
		} 
	}, 1000); 
}

//initiates with attack disabled until tutorial is complete
disableAttack();

function beginGame() {
	//hide the tutorial
	document.getElementById("tutorial").style.display = 'none';
	
	//remove blur on the rest
	var blurred = document.getElementById("blur");
	blurred.style.webkitFilter = "blur(0)";
	
	//ensure end game dialog is hidden
	document.getElementById("end").style.display = "none";
	
	//delete any lingering dice
	deleteDice();

	setTimeout(enableAttack,2200);
	
	//ensure characters are reset
	knight.health = 100;
	document.getElementById("knight-health").innerHTML = "Health: " + knight.health;
	dragon.health = 100;
	document.getElementById("dragon-health").innerHTML = "Health: " + dragon.health;
	document.getElementById("attack-total").innerHTML = "Total Attack: 0";
	
	//alert player it's their turn to attack
	setTimeout(function() {notify("Your turn ...","goodtext"); },1000);
}

//calls the begining of the game when the play button is clicked
var play = document.getElementsByClassName('play');
play[0].onclick = function() {beginGame();};
play[1].onclick = function() {beginGame();};

function attackByDragon() {	
    
    //decrement the knight's health, zero dragon's attack
    knight.health -= dragon.totalAttack;
    
    //update knight's health label
    document.getElementById("knight-health").innerHTML = "Health: " + knight.health;
    
    notify("The dragon attacked you with " + dragon.totalAttack + " damage!","badtext");
    
    dragon.totalAttack = 0;
	dragon.prevRoll = 0;    

    //check if the knight is defeated yet
    if (knight.health <= 0) {
    	//notify with end screen
    	setTimeout(function() {endGame('lost'); },2300);
    } else {  
		//knight's turn notification (delayed)
		setTimeout(function() {
			notify("Your turn ...","goodtext"); 
			
			//update the dragon's attack label
			document.getElementById("attack-total").innerHTML = "Total Attack: " + dragon.totalAttack;
		
		},2300);
		
		//delete dice
		setTimeout(deleteDice, 1600);
		
		//begin knight's turn
		setTimeout(enableAttack, 4500);
	}
    
}

function dragonRollDice() {
	//random choice of how many rolls the dragon should attack, from 1 to 9
	//less attempts if the knight's health is low
	
	var attempts = 0;
	
	if (knight.health <= 15) {
		attempts = Math.ceil(Math.random() * 3 + 1); 	
	} else {
		attempts = Math.ceil(Math.random() * 8 + 1); 	
	}

	var i = 0; //initiate counter
		
	function rollDice() {
	    setTimeout(function()	{
	    	var dragonRoll = Math.round(Math.random() * 5 + 1); //random attack from 1 to 6
	    		
	    	//if a 1 is rolled on the first roll, change it to a random new attack
	    	if (i === 0 && dragonRoll === 1) {
				    dragonRoll = Math.ceil(Math.random() * 5 + 1.1);
				}
	    	
	    	//create a new die from the roll
	    	var node = document.createElement("div");
	    	node.className = "dice";
	    	var textnode = document.createTextNode(dragonRoll);
	    	node.appendChild(textnode);
	    	document.getElementById("dice-bay").appendChild(node);
	    	
	    	dragon.totalAttack += dragonRoll;
	    	
	    	//end turn if a 1 is rolled
	    	if (dragonRoll === 1) {
					//turn last die's text red
					var badDice = document.getElementById("dice-bay").lastChild;
					badDice.className += " badtext";
					
					//end for loop with abstract number choice assignment
					//reset
					i = 20;
					dragon.totalAttack = 0;
					dragon.prevRoll = 0;
					
					notify("The dragon rolled a 1 and missed the attack!","goodtext");
					
					//delay next notification
				    setTimeout(function() {
				    	notify("Your turn ...","goodtext");
						//Update the Attack Total paragraph
						document.getElementById("attack-total").innerHTML = "Total Attack: " + dragon.totalAttack;
					}, 2300);
					
					//delete all .dice divs
					setTimeout(deleteDice, 1600);
					
				} else {
					//Update the Attack Total paragraph
					document.getElementById("attack-total").innerHTML = "Total Attack: " + dragon.totalAttack;
				}
	    	
			var goodDice = document.getElementById("dice-bay"); 
				
	    	//Double bonus if the last two dice rolled equal each other
			if (dragon.prevRoll === dragonRoll) {
				var doubleBonus = [goodDice.lastChild, goodDice.lastChild.previousElementSibling];
				doubleBonus[0].className += " goodtext";
				doubleBonus[1].className += " goodtext";
				//add double the roll to the Total Attack in addition to the normal total
				dragon.totalAttack += dragonRoll * 2;
			}
			
			//Triple bunus if the last three dice rolled equal each other
			   if (dragon.prev2Roll === dragon.prevRoll && dragon.prev2Roll === dragonRoll) {
				   var tripleBonus = [goodDice.lastChild, goodDice.lastChild.previousElementSibling, goodDice.lastChild.previousElementSibling.previousElementSibling];
				   tripleBonus[0].className += " goldendice";
				   tripleBonus[1].className += " goldendice";
				   tripleBonus[2].className += " goldendice";
				   //add double the roll to the Total Attack in addition to the normal total
				   dragon.totalAttack += dragonRoll * 3; 	    
			   }
			//set previous rolls   
			dragon.prev2Roll = dragon.prevRoll;
			dragon.prevRoll = dragonRoll;			
	    	i++;
	    	
	    	if (i < attempts) { 
	    		rollDice();
	    	} else if (i === attempts) {
		    	setTimeout(attackByDragon, 1000);
	    	} else {
	    		//begin the knight's turn
				setTimeout(enableAttack, 4000);
	    	} 	
	    }, 1000);
	} //end for loop
	
	//start loop defined above
	rollDice();
}

function knightRollDice() {
	knight.rollCount++;
	var knightRoll = Math.round(Math.random() * 5 + 1); //random attack from 1 to 6 
	
	//if a 1 is rolled on the first roll, change it to a random new attack
	if (knight.rollCount === 1 && knightRoll === 1) {
		knightRoll = Math.ceil(Math.random() * 4 + 2);
	}
	knight.totalAttack += knightRoll;
	
	//create a new die from the roll
	var node=document.createElement("div");
	node.className = "dice";
	var textnode=document.createTextNode(knightRoll);
	node.appendChild(textnode);
	document.getElementById("dice-bay").appendChild(node);
	
	//end turn if a 1 is rolled
	if (knightRoll === 1) {
		//turn last die's text red
    	var badDice = document.getElementById("dice-bay").lastChild;
		badDice.className += " badtext";

		disableAttack();
		knight.totalAttack = 0;
    	knight.rollCount = 0;
    	knight.prevRoll = 0;
    	
    	notify("You rolled a 1 and missed the attack!","badtext");
    	
    	//delay next notification

		setTimeout(function() {notify("Dragon's turn ...","badtext"); },2300);
    	
    	//delete dice
    	setTimeout(deleteDice, 1600);
		
		//begin the dragon's turn
		setTimeout(dragonRollDice, 3000);
    }
	
    var goodDice = document.getElementById("dice-bay");
    
	//Double bonus if the last two dice rolled equal each other
	if (knight.prevRoll === knightRoll && knight.prev2Roll !== knightRoll) {
		var doubleBonus = [goodDice.lastChild, goodDice.lastChild.previousElementSibling];
    	doubleBonus[0].className += " goodtext";
    	doubleBonus[1].className += " goodtext";
    	//add double the roll to the Total Attack in addition to the normal total
    	knight.totalAttack += knightRoll * 2;
    }
    //Triple bunus if the last three dice rolled equal each other
    if (knight.prev2Roll === knight.prevRoll && knight.prev2Roll === knightRoll) {
    	var tripleBonus = [goodDice.lastChild, goodDice.lastChild.previousElementSibling, goodDice.lastChild.previousElementSibling.previousElementSibling];
    	tripleBonus[0].className += " goldendice";
    	tripleBonus[1].className += " goldendice";
    	tripleBonus[2].className += " goldendice";
    	//add double the roll to the Total Attack in addition to the normal total
		knight.totalAttack += knightRoll * 3; 	    
    }
	knight.prev2Roll = knight.prevRoll;
    knight.prevRoll = knightRoll;

	//Update the Attack Total paragraph
	document.getElementById("attack-total").innerHTML = "Total Attack: " + knight.totalAttack; 
	
}
//calls the knight's dice roll when the roll dice button is clicked
document.getElementById('roll-dice').onclick = function() {knightRollDice();};
	
function attackByKnight() {
	disableAttack();

	//decrement the dragon's health
	dragon.health -= knight.totalAttack;

	//update dragon's health
	document.getElementById("dragon-health").innerHTML = "Health: " + dragon.health;

	notify("You attacked the dragon with " + knight.totalAttack + " damage!","goodtext");
	
	//check if the dragon is defeated yet
	if (dragon.health <= 0) {
		//notify with end screen
		setTimeout(function() {endGame('won'); }, 2300);
	} else {
		//dragon's turn notification (delayed)
		setTimeout(function() {
			notify("Dragon's turn ...","badtext");
			//update the Total Attack label
			document.getElementById("attack-total").innerHTML = "Total Attack: " + knight.totalAttack;
		}, 2300);
		
		//delete dice
		setTimeout(deleteDice, 1600);
		
		//begin dragon's turn
		setTimeout(dragonRollDice, 3000);
	}
	
	knight.totalAttack = 0;
	knight.rollCount = 0;
   	knight.prevRoll = 0;
}

//calls the attack function when the attack button is clicked
document.getElementById('attack').onclick = function() {attackByKnight();};














