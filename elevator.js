document.addEventListener('DOMContentLoaded', function () {
    var floorHeight = 110;
    var submitBtn = document.getElementById('submitBtn');
    var mainContainer = document.querySelector('.mainContainer');
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
            var buildingContainer = document.createElement('div');
            buildingContainer.classList.add('buildingContainer');
            buildingContainer.id = "building".concat(i);
            mainContainer.appendChild(buildingContainer);
            new Building(i, numFloors, numElevators, floorHeight, buildingContainer);
        }
    });
    var Building = /** @class */ (function () {
        function Building(id, numFloors, numElevators, floorHeight, container) {
            this.id = id;
            this.numFloors = numFloors;
            this.numElevators = numElevators;
            this.floorHeight = floorHeight;
            this.container = container;
            this.initBuilding();
        }
        Building.prototype.initBuilding = function () {
            var _this = this;
            var floorsContainer = document.createElement('div');
            floorsContainer.classList.add('floorsContainer');
            var elevatorsContainer = document.createElement('div');
            elevatorsContainer.classList.add('elevatorsContainer');
            // Create floors
            for (var j = this.numFloors - 1; j >= 0; j--) {
                var floorDiv = document.createElement('div');
                floorDiv.classList.add('floor');
                var button = document.createElement('button');
                button.id = "b".concat(this.id, "f").concat(j);
                button.classList.add('metal', 'linear');
                button.innerText = "".concat(j);
                // Add timer span element
                var timerSpan = document.createElement('span');
                timerSpan.id = "b".concat(this.id, "t").concat(j);
                timerSpan.classList.add('timer');
                timerSpan.innerText = '000';
                floorDiv.appendChild(button);
                floorDiv.appendChild(timerSpan);
                floorsContainer.appendChild(floorDiv);
            }
            // Create elevators
            for (var k = 0; k < this.numElevators; k++) {
                var elevatorDiv = document.createElement('div');
                elevatorDiv.classList.add("elevator".concat(k + 1));
                var elevatorImg = document.createElement('img');
                elevatorImg.id = "b".concat(this.id, "e").concat(k);
                elevatorImg.src = "elv.png";
                elevatorImg.alt = "elevator".concat(k + 1);
                elevatorImg.height = 103;
                elevatorDiv.appendChild(elevatorImg);
                elevatorsContainer.appendChild(elevatorDiv);
            }
            this.container.appendChild(floorsContainer);
            this.container.appendChild(elevatorsContainer);
            // Instantiate controller for this building
            this.controller = new ElevatorController(this.numElevators, this.floorHeight, this.id);
            var _loop_1 = function (i) {
                var button = document.getElementById("b".concat(this_1.id, "f").concat(i));
                if (button) {
                    button.addEventListener("click", function () {
                        var targetFloor = parseInt(button.id.replace("b".concat(_this.id, "f"), ""));
                        _this.controller.callElevator(targetFloor);
                    });
                }
                else {
                    console.error("Element with ID 'b".concat(this_1.id, "f").concat(i, "' not found."));
                }
            };
            var this_1 = this;
            // Attach event listeners
            for (var i = 0; i < this.numFloors; i++) {
                _loop_1(i);
            }
        };
        return Building;
    }());
    var Elevator = /** @class */ (function () {
        function Elevator(id, element, floorHeight) {
            this.id = id;
            this.currentFloor = 0;
            this.element = element;
            this.floorHeight = floorHeight;
            this.destinations = [];
            this.inMotion = false;
            this.elevatorSound = new Audio('ding.mp3');
            this.timerInterval = null;
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
            var distanceToMove = targetFloor * this.floorHeight;
            var speed = 110 / 0.5;
            var calculateDuration = Math.abs((this.currentFloor - targetFloor) * this.floorHeight) / speed;
            var travelTimeInSeconds = Math.ceil(calculateDuration);
            console.log("Moving from floor ".concat(this.currentFloor, " to floor ").concat(targetFloor));
            this.startCountdown(targetFloor, travelTimeInSeconds);
            this.inMotion = true;
            this.animateMovement(distanceToMove);
            this.currentFloor = targetFloor;
            setTimeout(function () {
                console.log("Elevator Reached The Floor");
                _this.playElevatorSound();
            }, (calculateDuration * 1000) - 500);
            setTimeout(function () {
                if (_this.destinations.length > 0) {
                    console.log("Elevator Goes To Next Destination");
                }
                _this.inMotion = false;
                _this.processNextDestination();
                _this.stopElevatorSound();
                _this.resetTimer(targetFloor);
            }, (calculateDuration * 1000) + 2000);
        };
        Elevator.prototype.animateMovement = function (distanceToMove) {
            var speed = 110 / 0.5;
            var duration = Math.abs((this.currentFloor * this.floorHeight) - distanceToMove) / speed;
            this.element.style.transition = "transform ".concat(duration, "s ease");
            this.element.style.transform = "translateY(".concat(-distanceToMove, "px)");
        };
        Elevator.prototype.startCountdown = function (floor, seconds) {
            var _this = this;
            var timerElement = document.getElementById("b".concat(this.id, "t").concat(floor));
            if (timerElement) {
                var remainingSeconds_1 = seconds;
                timerElement.innerText = remainingSeconds_1.toString().padStart(3, '0');
                this.timerInterval = window.setInterval(function () {
                    remainingSeconds_1--;
                    timerElement.innerText = remainingSeconds_1.toString().padStart(3, '0');
                    if (remainingSeconds_1 <= 0) {
                        clearInterval(_this.timerInterval);
                    }
                }, 1000);
            }
        };
        Elevator.prototype.resetTimer = function (floor) {
            var timerElement = document.getElementById("b".concat(this.id, "t").concat(floor));
            if (timerElement) {
                timerElement.innerText = '000';
            }
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        };
        return Elevator;
    }());
    var ElevatorController = /** @class */ (function () {
        function ElevatorController(numElevators, floorHeight, buildingId) {
            this.floorHeight = floorHeight;
            this.buildingId = buildingId;
            this.elevators = [];
            // Initialize elevators
            for (var i = 0; i < numElevators; i++) {
                var elevatorElement = document.getElementById("b".concat(buildingId, "e").concat(i));
                if (elevatorElement) {
                    var elevator = new Elevator(i, elevatorElement, floorHeight);
                    this.elevators.push(elevator);
                }
                else {
                    console.error("Element with ID 'b".concat(buildingId, "e").concat(i, "' not found."));
                }
            }
        }
        ElevatorController.prototype.callElevator = function (targetFloor) {
            var elevatorOnFloor = this.elevators.find(function (elevator) { return elevator.currentFloor === targetFloor; });
            if (elevatorOnFloor) {
                console.log("Elevator ".concat(elevatorOnFloor.id, " is already on floor ").concat(targetFloor, ". Ignoring request."));
                return;
            }
            var shortestQueueIndex = 0;
            var shortestQueueTime = Infinity;
            var _loop_2 = function (i) {
                var elevator = this_2.elevators[i];
                var timeToReachFloor = Math.abs(elevator.currentFloor - targetFloor) * 0.5;
                var timeToServeQueue = elevator.destinations.reduce(function (acc, floor) { return acc + Math.abs(floor - elevator.currentFloor); }, 0) * 2;
                var totalQueueTime = timeToReachFloor + timeToServeQueue;
                if (totalQueueTime < shortestQueueTime) {
                    shortestQueueTime = totalQueueTime;
                    shortestQueueIndex = i;
                }
            };
            var this_2 = this;
            for (var i = 0; i < this.elevators.length; i++) {
                _loop_2(i);
            }
            var selectedElevator = this.elevators[shortestQueueIndex];
            selectedElevator.moveToFloor(targetFloor);
        };
        return ElevatorController;
    }());
});
