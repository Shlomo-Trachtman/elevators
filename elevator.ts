document.addEventListener('DOMContentLoaded', () => {

    const floorHeight = 110;

    const submitBtn = document.getElementById('submitBtn')!;
    const mainContainer = document.querySelector('.mainContainer')!;

    submitBtn.addEventListener('click', () => {
        const numBuildingsInput = document.getElementById('numBuildings') as HTMLInputElement;
        const numFloorsInput = document.getElementById('numFloors') as HTMLInputElement;
        const numElevatorsInput = document.getElementById('numElevators') as HTMLInputElement;

        const numBuildings = parseInt(numBuildingsInput.value);
        const numFloors = parseInt(numFloorsInput.value);
        const numElevators = parseInt(numElevatorsInput.value);

        // Clear existing buildings if any
        mainContainer.innerHTML = '';

        // Generate buildings
        for (let i = 0; i < numBuildings; i++) {
            const buildingContainer = document.createElement('div');
            buildingContainer.classList.add('buildingContainer');
            buildingContainer.id = `building${i}`;
            mainContainer.appendChild(buildingContainer);

            new Building(i, numFloors, numElevators, floorHeight, buildingContainer);
        }
    });

    class Building {
        id: number;
        numFloors: number;
        numElevators: number;
        floorHeight: number;
        container: HTMLElement;
        controller: ElevatorController;

        constructor(id: number, numFloors: number, numElevators: number, floorHeight: number, container: HTMLElement) {
            this.id = id;
            this.numFloors = numFloors;
            this.numElevators = numElevators;
            this.floorHeight = floorHeight;
            this.container = container;

            this.initBuilding();
        }

        initBuilding() {
            const floorsContainer = document.createElement('div');
            floorsContainer.classList.add('floorsContainer');

            const elevatorsContainer = document.createElement('div');
            elevatorsContainer.classList.add('elevatorsContainer');

            // Create floors
            for (let j = this.numFloors - 1; j >= 0; j--) {
                const floorDiv = document.createElement('div');
                floorDiv.classList.add('floor');
                const button = document.createElement('button');
                button.id = `b${this.id}f${j}`;
                button.classList.add('metal', 'linear');
                button.innerText = `${j}`;

                // Add timer span element
                const timerSpan = document.createElement('span');
                timerSpan.id = `b${this.id}t${j}`;
                timerSpan.classList.add('timer');
                timerSpan.innerText = '000';

                floorDiv.appendChild(button);
                floorDiv.appendChild(timerSpan);
                floorsContainer.appendChild(floorDiv);
            }

            // Create elevators
            for (let k = 0; k < this.numElevators; k++) {
                const elevatorDiv = document.createElement('div');
                elevatorDiv.classList.add(`elevator${k + 1}`);
                const elevatorImg = document.createElement('img');
                elevatorImg.id = `b${this.id}e${k}`;
                elevatorImg.src = "elv.png";
                elevatorImg.alt = `elevator${k + 1}`;
                elevatorImg.height = 103;
                elevatorDiv.appendChild(elevatorImg);
                elevatorsContainer.appendChild(elevatorDiv);
            }

            this.container.appendChild(floorsContainer);
            this.container.appendChild(elevatorsContainer);

            // Instantiate controller for this building
            this.controller = new ElevatorController(this.numElevators, this.floorHeight, this.id);

            // Attach event listeners
            for (let i = 0; i < this.numFloors; i++) {
                const button = document.getElementById(`b${this.id}f${i}`);
                if (button) {
                    button.addEventListener("click", () => {
                        const targetFloor = parseInt(button.id.replace(`b${this.id}f`, ""));
                        this.controller.callElevator(targetFloor);
                    });
                } else {
                    console.error(`Element with ID 'b${this.id}f${i}' not found.`);
                }
            }
        }
    }

    interface BuildingElement {
        id: number;
        element: HTMLElement;
    }

    class Elevator implements BuildingElement {
        id: number;
        currentFloor: number;
        element: HTMLElement;
        floorHeight: number;
        destinations: number[];
        inMotion: boolean;
        elevatorSound: HTMLAudioElement;
        timerInterval: number | null;

        constructor(id: number, element: HTMLElement, floorHeight: number) {
            this.id = id;
            this.currentFloor = 0;
            this.element = element!;
            this.floorHeight = floorHeight;
            this.destinations = [];
            this.inMotion = false;
            this.elevatorSound = new Audio('ding.mp3');
            this.timerInterval = null;
        }

        playElevatorSound() {
            this.elevatorSound.play();
        }

        stopElevatorSound() {
            this.elevatorSound.pause();
            this.elevatorSound.currentTime = 0;
        }

        moveToFloor(targetFloor: number) {
            this.destinations.push(targetFloor);
            this.processNextDestination();
        }

        private processNextDestination() {
            if (!this.inMotion && this.destinations.length > 0 && this.currentFloor !== this.destinations[0]) {
                const nextFloor = this.destinations.shift()!;
                this.animateMovementToFloor(nextFloor);
            }
        }

        private animateMovementToFloor(targetFloor: number) {
            const distanceToMove = targetFloor * this.floorHeight;
            const speed = 110 / 0.5;
            const calculateDuration = Math.abs((this.currentFloor - targetFloor) * this.floorHeight) / speed;
            const travelTimeInSeconds = Math.ceil(calculateDuration);

            console.log(`Moving from floor ${this.currentFloor} to floor ${targetFloor}`);
            this.startCountdown(targetFloor, travelTimeInSeconds);
            this.inMotion = true;
            this.animateMovement(distanceToMove);
            this.currentFloor = targetFloor;

            setTimeout(() => {
                console.log(`Elevator Reached The Floor`);
                this.playElevatorSound();
            }, (calculateDuration * 1000) - 500);

            setTimeout(() => {
                if (this.destinations.length > 0) {
                    console.log(`Elevator Goes To Next Destination`);
                }
                this.inMotion = false;
                this.processNextDestination();
                this.stopElevatorSound();
                this.resetTimer(targetFloor);
            }, (calculateDuration * 1000) + 2000);
        }

        public animateMovement(distanceToMove: number) {
            const speed = 110 / 0.5;
            const duration = Math.abs((this.currentFloor * this.floorHeight) - distanceToMove) / speed;
            this.element.style.transition = `transform ${duration}s ease`;
            this.element.style.transform = `translateY(${-distanceToMove}px)`;
        }

        private startCountdown(floor: number, seconds: number) {
            const timerElement = document.getElementById(`b${this.id}t${floor}`);
            if (timerElement) {
                let remainingSeconds = seconds;
                timerElement.innerText = remainingSeconds.toString().padStart(3, '0');
                this.timerInterval = window.setInterval(() => {
                    remainingSeconds--;
                    timerElement.innerText = remainingSeconds.toString().padStart(3, '0');
                    if (remainingSeconds <= 0) {
                        clearInterval(this.timerInterval!);
                    }
                }, 1000);
            }
        }

        private resetTimer(floor: number) {
            const timerElement = document.getElementById(`b${this.id}t${floor}`);
            if (timerElement) {
                timerElement.innerText = '000';
            }
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        }
    }

    class ElevatorController {
        elevators: Elevator[];
        floorHeight: number;
        buildingId: number;

        constructor(numElevators: number, floorHeight: number, buildingId: number) {
            this.floorHeight = floorHeight;
            this.buildingId = buildingId;
            this.elevators = [];

            // Initialize elevators
            for (let i = 0; i < numElevators; i++) {
                const elevatorElement = document.getElementById(`b${buildingId}e${i}`)!;
                if (elevatorElement) {
                    const elevator = new Elevator(i, elevatorElement, floorHeight);
                    this.elevators.push(elevator);
                } else {
                    console.error(`Element with ID 'b${buildingId}e${i}' not found.`);
                }
            }
        }

        callElevator(targetFloor: number) {
            const elevatorOnFloor = this.elevators.find(elevator => elevator.currentFloor === targetFloor);

            if (elevatorOnFloor) {
                console.log(`Elevator ${elevatorOnFloor.id} is already on floor ${targetFloor}. Ignoring request.`);
                return;
            }

            let shortestQueueIndex = 0;
            let shortestQueueTime = Infinity;
            for (let i = 0; i < this.elevators.length; i++) {
                const elevator = this.elevators[i];
                const timeToReachFloor = Math.abs(elevator.currentFloor - targetFloor) * 0.5;
                const timeToServeQueue = elevator.destinations.reduce((acc, floor) => acc + Math.abs(floor - elevator.currentFloor), 0) * 2;
                const totalQueueTime = timeToReachFloor + timeToServeQueue;
                if (totalQueueTime < shortestQueueTime) {
                    shortestQueueTime = totalQueueTime;
                    shortestQueueIndex = i;
                }
            }

            const selectedElevator = this.elevators[shortestQueueIndex];
            selectedElevator.moveToFloor(targetFloor);
        }
    }

});
