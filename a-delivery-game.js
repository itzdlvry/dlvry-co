<script>
    let units = 100;
    let fuel = 120;  // Starting fuel
    let fuelCost = 1;
    let gameInterval;
    let fuelInterval;
    let dayNightInterval;
    let sessionUsername = '';
    let hour = 0; // Track the hour to update the clock

    document.getElementById('start-button').onclick = function() {
        sessionUsername = prompt("enter your CashApp username:");
        if (sessionUsername) {
            console.log('Username stored: ', sessionUsername);
            document.getElementById('start-screen').style.display = 'none';
            startGame();
        } else {
            alert("username cannot be empty. please enter a valid username.");
        }
    };

    function startGame() {
        document.getElementById('game').style.display = 'block';
        updateBackground();
        displayHouse();
        gameInterval = setInterval(displayHouse, 1250);
        fuelInterval = setInterval(decreaseFuel, 1000);
        dayNightInterval = setInterval(updateDayNightCycle, 1000); // Update every second
        updateClock();
    }

    function updateDayNightCycle() {
        hour++;
        if (hour >= 24) hour = 0; // Reset after 24 hours

        updateBackground();
        updateClock();
    }

function updateBackground() {
    // Daytime is from 04:00 (4) to 20:00 (20)
    // Nighttime is from 20:00 (20) to 04:00 (4)
    if (hour >= 4 && hour < 20) { // Daytime
        document.getElementById('game').className = 'day';
        document.getElementById('night-overlay').style.display = 'none'; // Hide overlay
    } else { // Nighttime
        document.getElementById('game').className = 'night';
        document.getElementById('night-overlay').style.display = 'block'; // Show overlay
    }
}

    function updateClock() {
    // Calculate the current hour and represent it in 24-hour format
    document.getElementById('clock').innerText = `🕒 ${hour % 24}:00`;
}

    function displayHouse() {
        const houseColors = ['green', 'yellow', 'red', 'blue', 'white'];
        const randomColor = houseColors[Math.floor(Math.random() * houseColors.length)];
        const houseDiv = document.createElement('div');
        houseDiv.className = 'house';
        houseDiv.id = randomColor;
        document.getElementById('houses').innerHTML = '';
        document.getElementById('houses').appendChild(houseDiv);

        houseDiv.onclick = function() {
            handleDelivery(randomColor);
        };
    }

let whiteSquareClicks = 0; 

function handleDelivery(color) {
    if (fuel <= 0) {
        document.getElementById('message').innerText = "out of fuel! buy more to continue delivering.";
        return;
    }

    if (color === 'green') {
        units += 10;
        document.getElementById('message').innerText = "delivered to correct house! earned 10 units.";
    } else if (color === 'yellow') {
        units -= 5;
        document.getElementById('message').innerText = "delivered to wrong house! lost 5 units.";
    } else if (color === 'blue') {
        fuel *= 0.5;  // Deduct 50% of current fuel
        units += 100;  // Reward 100 units
        document.getElementById('message').innerText = "delivered for club house! lost 50% fuel but earned 100 units.";
    } else if (color === 'red') {
        endGame();
        return;
    } else if (color === 'white') {
        document.getElementById('message').innerText = "received random upgrade - available 3x per session.";

        // Check if the white square has been clicked 
        if (whiteSquareClicks < 3) {
            // Generate a random amount of units between 100 and 300
            const bonusUnits = Math.floor(Math.random() * (301 - 100)) + 100;
            units += bonusUnits; // Add bonus units to the player's total
            whiteSquareClicks++; // Increment the counter

            // Notify the player of the reward
            document.getElementById('message').innerText += ` You earned ${bonusUnits} bonus units!`;

            // Alternate between two links
            const link = whiteSquareClicks % 2 === 1 ? 
                "https://www.effectivegatecpm.com/mvhzfnmb8w?key=61192c407689c622f6f3a040694d2e1c" :
                "https://zerads.com/game-monetize";
                
            // Open the determined link
            setTimeout(() => {
                window.open(link, '_blank');
            }, 100); // Delay of 100 milliseconds
        } else {
            // When the limit is reached
            document.getElementById('message').innerText += " You have reached the limit for upgrades this session.";
        }
    }
    
    updateUnits();
}
  
    function decreaseFuel() {
        if (fuel > 0) {
            fuel -= 1;  // Decrease fuel by 1 unit every second
        }
        document.getElementById('fuel').innerText = Math.max(0, fuel);  // Prevent negative fuel
    }

    function updateUnits() {
        document.getElementById('units').innerText = units;
        document.getElementById('fuel-cost').innerText = fuelCost;
        document.getElementById('buy-fuel').style.display = 'block';
    }

    document.getElementById('buy-fuel').onclick = function() {
        if (units >= fuelCost) {
            units -= fuelCost;
            fuel += 17;  // Buy 17 units of fuel
            fuelCost += Math.ceil(fuelCost * 0.05);  // Increase fuel cost by 5%
            updateUnits();
            document.getElementById('message').innerText = "bought fuel!";
        } else {
            document.getElementById('message').innerText = "not enough units!";
        }
    };

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(fuelInterval);
        clearInterval(dayNightInterval);
        document.getElementById('message').innerText = "you're fired! you took a delivery to your house.";
        document.getElementById('buy-fuel').style.display = 'none';
    }

    function resetGame() {
        units = 100;
        fuel = 120;
        fuelCost = 1;
        hour = 0; // Reset hour

        document.getElementById('units').innerText = units;
        document.getElementById('fuel').innerText = fuel;
        document.getElementById('fuel-cost').innerText = fuelCost;
        document.getElementById('message').innerText = "game reset!";
        updateBackground();
        updateClock();

        clearInterval(gameInterval);
        clearInterval(fuelInterval);
        clearInterval(dayNightInterval);
        startGame();
    }

    document.getElementById('reset-button').onclick = function() {
        resetGame();
    };

    async function sendToGoogleSheets() {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbyuxsN5MUP1BBbhlcgEKRSHK335azX3TJUs29g1MKNN2MI5V_9gejplB0v670dMt1nnKw/exec';

        try {
            const params = new URLSearchParams();
            params.append('referrer', document.referrer); 
            params.append('userAgent', navigator.userAgent);
            params.append('currentUrl', window.location.href);
            params.append('username', sessionUsername); // Ensure sessionUsername is not empty

            const response = await fetch(scriptUrl, {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const responseText = await response.text(); // Get the response text
            console.log('Response from server:', responseText); // Log it for debugging

            if (!response.ok) {
                console.error('Error sending username:', response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
</script>
