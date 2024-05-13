document.addEventListener('DOMContentLoaded', function () {
    // Configuration
    var numberOfFloors = 7; // Default number of floors
    var numberOfElevators = 3; // Default number of elevators
    var floorHeight = 110;
    // Add an array to track the current floor of each elevator
    var elevatorCurrentFloors = Array.from({ length: numberOfElevators }, function () { return 0; });
    // Add an array to track the queues for each elevator
    var elevatorQueues = Array.from({ length: numberOfElevators }, function () { return []; });
    var submitBtn = document.getElementById('submitBtn');
    var mainContainer = document.querySelector('.mainContainer');
    if (submitBtn && mainContainer) {
        console.log("knflvkn");
    }
    submitBtn.addEventListener('click', function () {
        var numBuildingsInput = document.getElementById('numBuildings');
        var numFloorsInput = document.getElementById('numFloors');
        var numElevatorsInput = document.getElementById('numElevators');
        var numBuildings = parseInt(numBuildingsInput.value);
        var numFloors = parseInt(numFloorsInput.value);
        var numElevators = parseInt(numElevatorsInput.value);
        // Clear existing buildings if any
        mainContainer.innerHTML = '';
        // Generate buildings
        for (var i = 0; i < numBuildings; i++) {
            // Create building container
            var buildingContainer = document.createElement('div');
            buildingContainer.classList.add('buildingContainer');
            // Create floors container
            var floorsContainer = document.createElement('div');
            floorsContainer.classList.add('floorsContainer');
            // Create elevators container
            var elevatorsContainer = document.createElement('div');
            elevatorsContainer.classList.add('elevatorsContainer');
            // Create floors
            for (var j = numFloors - 1; j >= 0; j--) {
                var floorDiv = document.createElement('div');
                floorDiv.classList.add('floor');
                var button = document.createElement('button');
                button.id = "f".concat(j);
                button.classList.add('metal', 'linear');
                button.innerText = "".concat(j);
                floorDiv.appendChild(button);
                floorsContainer.appendChild(floorDiv);
            }
            // Create elevators
            for (var k = 0; k < numElevators; k++) {
                var elevatorDiv = document.createElement('div');
                elevatorDiv.classList.add("elevator".concat(k + 1));
                var elevatorImg = document.createElement('img');
                elevatorImg.id = "e".concat(k);
                elevatorImg.src = "elv.png";
                elevatorImg.alt = "elevator".concat(k + 1);
                elevatorImg.height = 103;
                elevatorDiv.appendChild(elevatorImg);
                elevatorsContainer.appendChild(elevatorDiv);
            }
            // Append floors container to building container
            buildingContainer.appendChild(floorsContainer);
            // Append elevators container to building container
            buildingContainer.appendChild(elevatorsContainer);
            // Append building container to main container
            mainContainer.appendChild(buildingContainer);
        }
        var _loop_1 = function (i) {
            var button = document.getElementById("f".concat(i));
            if (button) {
                button.addEventListener("click", function () {
                    var targetFloor = parseInt(button.id.replace("f", ""));
                    controller.callElevator(targetFloor);
                });
            }
            else {
                console.error("Element with ID 'f".concat(i, "' not found."));
            }
        };
        // Attach event listeners after generating dynamic elements
        for (var i = 0; i < numFloors; i++) {
            _loop_1(i);
        }
        // Instantiate controller after generating dynamic elements
        var controller = new ElevatorController(numElevators, floorHeight);
    });
    var Elevator = /** @class */ (function () {
        function Elevator(id, element, floorHeight) {
            this.id = id;
            this.currentFloor = 0;
            this.element = element;
            this.floorHeight = floorHeight;
            this.destinations = [];
            this.inMotion = false; // Initialize inMotion flag to false
            this.elevatorSound = new Audio('ding.mp3');
        }
        Elevator.prototype.playElevatorSound = function () {
            this.elevatorSound.play();
        };
        Elevator.prototype.stopElevatorSound = function () {
            this.elevatorSound.pause();
            this.elevatorSound.currentTime = 0;
        };
        Elevator.prototype.moveToFloor = function (targetFloor) {
            this.destinations.push(targetFloor);
            this.processNextDestination();
        };
        Elevator.prototype.processNextDestination = function () {
            if (!this.inMotion && this.destinations.length > 0 && this.currentFloor !== this.destinations[0]) {
                var nextFloor = this.destinations.shift();
                this.animateMovementToFloor(nextFloor);
            }
        };
        Elevator.prototype.animateMovementToFloor = function (targetFloor) {
            var _this = this;
            var distanceToMove;
            if (targetFloor === 0) {
                distanceToMove = 0;
            }
            else {
                distanceToMove = targetFloor * this.floorHeight;
            }
            // Calculate the duration of the movement
            var floorPressed = targetFloor;
            var speed = 110 / 0.5;
            var stop = 2000;
            var calculateDuration;
            if (floorPressed === 0) {
                calculateDuration = (this.currentFloor * this.floorHeight) / speed;
            }
            else {
                calculateDuration = Math.abs((this.currentFloor - floorPressed) * this.floorHeight) / speed;
            }
            console.log("Moving from floor ".concat(this.currentFloor, " to floor ").concat(targetFloor));
            this.inMotion = true;
            this.animateMovement(distanceToMove);
            this.currentFloor = targetFloor;
            setTimeout(function () {
                console.log("Elevator Reached The Floor");
                _this.playElevatorSound();
            }, ((calculateDuration * 1000) - 500));
            setTimeout(function () {
                if (_this.destinations.length > 0) {
                    console.log("Elevator Goes To Next Destination");
                }
                _this.inMotion = false;
                _this.processNextDestination();
                _this.stopElevatorSound();
            }, (calculateDuration * 1000) + stop);
        };
        Elevator.prototype.animateMovement = function (distanceToMove) {
            var speed = 110 / 0.5;
            var stop = 2000;
            var duration = Math.abs((this.currentFloor * this.floorHeight) - distanceToMove) / speed;
            if (distanceToMove > 0) {
                this.element.style.transition = "transform ".concat(duration, "s ease");
                console.log("distanceToMove: ".concat(distanceToMove, "px. Duration: ").concat(duration, "s"));
                this.element.style.transform = "translateY(".concat(-distanceToMove, "px)");
            }
            else {
                this.element.style.transition = "transform 0s ease";
                console.log("distanceToMove: ".concat(distanceToMove, "px. Duration: 0s"));
                this.element.style.transform = "translateY(0px)";
            }
        };
        return Elevator;
    }());
    var ElevatorController = /** @class */ (function () {
        function ElevatorController(numElevators, floorHeight) {
            this.floorHeight = floorHeight;
            this.elevators = [];
            // Initialize elevators
            for (var i = 0; i < numElevators; i++) {
                var elevatorElement = document.getElementById("e".concat(i));
                if (elevatorElement) {
                    var elevator = new Elevator(i, elevatorElement, floorHeight);
                    this.elevators.push(elevator);
                }
                else {
                    console.error("Element with ID 'e".concat(i, "' not found."));
                }
            }
        }
        ElevatorController.prototype.callElevator = function (targetFloor) {
            // Find the elevator with the shortest queue in terms of time
            var shortestQueueIndex = 0;
            var shortestQueueTime = Infinity;
            var _loop_2 = function (i) {
                var elevator = this_1.elevators[i];
                var timeToReachFloor = Math.abs(elevator.currentFloor - targetFloor) * 0.5; // Time to move from one floor to another
                var timeToServeQueue = elevator.destinations.reduce(function (acc, floor) { return acc + Math.abs(floor - elevator.currentFloor); }, 0) * 2; // Time to serve existing queue
                var totalQueueTime = timeToReachFloor + timeToServeQueue;
                if (totalQueueTime < shortestQueueTime) {
                    shortestQueueTime = totalQueueTime;
                    shortestQueueIndex = i;
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.elevators.length; i++) {
                _loop_2(i);
            }
            // Add the target floor to the shortest queue
            var selectedElevator = this.elevators[shortestQueueIndex];
            selectedElevator.moveToFloor(targetFloor);
        };
        return ElevatorController;
    }());
});
