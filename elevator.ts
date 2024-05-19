
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

            const elevatorFactory = new ElevatorFactory();
            new Building(i, numFloors, numElevators, floorHeight, buildingContainer, elevatorFactory);
        }
    });

    // Elevator Factory
    class ElevatorFactory {
        createElevator(id: number, element: HTMLElement, floorHeight: number): Elevator {
            return new Elevator(id, element, floorHeight);
        }
    }

    class Building {
        id: number;
        numFloors: number;
        numElevators: number;
        floorHeight: number;
        container: HTMLElement;
        controller: ElevatorController;
        elevatorFactory: ElevatorFactory;

        constructor(id: number, numFloors: number, numElevators: number, floorHeight: number, container: HTMLElement, elevatorFactory: ElevatorFactory) {
            this.id = id;
            this.numFloors = numFloors;
            this.numElevators = numElevators;
            this.floorHeight = floorHeight;
            this.container = container;
            this.elevatorFactory = elevatorFactory;

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
                const elevatorElement = document.createElement('div');
                elevatorElement.classList.add(`elevator${k + 1}`);
                const elevatorImg = document.createElement('img');
                elevatorImg.id = `b${this.id}e${k}`;
                elevatorImg.src = "elv.png";
                elevatorImg.alt = `elevator${k + 1}`;
                elevatorImg.height = 103;
                elevatorElement.appendChild(elevatorImg);
                elevatorsContainer.appendChild(elevatorElement);

                // Create elevator instance using factory
                const elevator = this.elevatorFactory.createElevator(k, elevatorElement, this.floorHeight);
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

    class Elevator {
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
                this.resetTimer(this.id, targetFloor);
            }, (calculateDuration * 1000) + 2000);
        }

        public animateMovement(distanceToMove: number) {
            const speed = 110 / 0.5;
            const duration = Math.abs((this.currentFloor * this.floorHeight) - distanceToMove) / speed;
            this.element.style.transition = `transform ${duration}s ease`;
            this.element.style.transform = `translateY(${-distanceToMove}px)`;
        }

        public startCountdown(buildingId: number, targetFloor: number) {
            const timerElement = document.getElementById(`b${buildingId}t${targetFloor}`);
            if (timerElement) {
                const totalTimeInSeconds = this.calculateTotalTimeToReach(targetFloor);
                timerElement.innerText = totalTimeInSeconds.toString().padStart(3, '0');
        
                // Start the countdown
                const startTime = new Date().getTime();
                const countdown = () => {
                    const currentTime = new Date().getTime();
                    const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
                    const remainingTime = totalTimeInSeconds - elapsedTimeInSeconds;
        
                    // Update the timer display
                    if (remainingTime >= 0) {
                        timerElement.innerText = remainingTime.toString().padStart(3, '0');
                    } else {
                        clearInterval(this.timerInterval!);
                    }
                };
        
                // Update the countdown every second
                this.timerInterval = window.setInterval(countdown, 1000);
        
                // Update the timer immediately
                countdown();
            }
        }
        

            public calculateTotalTimeToReach(targetFloor: number): number {
                let totalTimeInSeconds = 0;
                let lastFloor = this.currentFloor;

                // Calculate time to serve all previous calls in the queue
                for (let i = 0; i < this.destinations.length; i++) {
                    const destinationFloor = this.destinations[i];
                    const distance = Math.abs(destinationFloor - lastFloor);
                    const moveTime = distance * 0.5; // Time for movement
                    const stopTime = 2; // Time for stop
                    const subtotal = moveTime + stopTime; // Subtotal for this stop

                    totalTimeInSeconds += subtotal;
                    lastFloor = destinationFloor;



                }

                // Calculate time from the last floor in the queue to the target floor
                const finalDistance = Math.abs(targetFloor - lastFloor);
                totalTimeInSeconds += finalDistance * 0.5;

                return totalTimeInSeconds;
        }

        resetTimer(buildingId: number, floor: number) {
            const timerElement = document.getElementById(`b${buildingId}t${floor}`);
            if (timerElement) {
                timerElement.innerText = '000';
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
            selectedElevator.startCountdown(this.buildingId, targetFloor);
            selectedElevator.moveToFloor(targetFloor);
        }
    }
});
