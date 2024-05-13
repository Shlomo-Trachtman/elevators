document.addEventListener('DOMContentLoaded', () => {

    // Configuration
    let numberOfFloors: number = 7; // Default number of floors
    let numberOfElevators: number = 3; // Default number of elevators
    const floorHeight = 110;

    // Add an array to track the current floor of each elevator
    let elevatorCurrentFloors: number[] = Array.from({ length: numberOfElevators }, () => 0);

    // Add an array to track the queues for each elevator
    let elevatorQueues: number[][] = Array.from({ length: numberOfElevators }, () => []);

    const submitBtn = document.getElementById('submitBtn')!;
    const mainContainer = document.querySelector('.mainContainer')!;

    if (submitBtn && mainContainer) {
        console.log(`knflvkn`)
    }

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
            // Create building container
            const buildingContainer = document.createElement('div');
            buildingContainer.classList.add('buildingContainer');
    
            // Create floors container
            const floorsContainer = document.createElement('div');
            floorsContainer.classList.add('floorsContainer');
    
            // Create elevators container
            const elevatorsContainer = document.createElement('div');
            elevatorsContainer.classList.add('elevatorsContainer');
    
            // Create floors
            for (let j = numFloors-1; j >= 0; j--) {
                const floorDiv = document.createElement('div');
                floorDiv.classList.add('floor');
                const button = document.createElement('button');
                button.id = `f${j}`;
                button.classList.add('metal', 'linear');
                button.innerText = `${j}`;
                floorDiv.appendChild(button);
                floorsContainer.appendChild(floorDiv);
            }
    
            // Create elevators
            for (let k = 0; k < numElevators; k++) {
                const elevatorDiv = document.createElement('div');
                elevatorDiv.classList.add(`elevator${k + 1}`);
                const elevatorImg = document.createElement('img');
                elevatorImg.id = `e${k}`;
                elevatorImg.src = "elv.png";
                elevatorImg.alt = `elevator${k + 1}`;
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

        // Attach event listeners after generating dynamic elements
        for (let i = 0; i < numFloors; i++) {
            const button = document.getElementById(`f${i}`);
            if (button) {
                button.addEventListener("click", () => {
                    const targetFloor = parseInt(button.id.replace("f", ""));
                    controller.callElevator(targetFloor);
                });
            } else {
                console.error(`Element with ID 'f${i}' not found.`);
            }
        }

        // Instantiate controller after generating dynamic elements
        const controller = new ElevatorController(numElevators, floorHeight);
    });
    
    
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
        inMotion: boolean; // Flag to indicate whether the elevator is in motion
        elevatorSound: HTMLAudioElement;

        constructor(id: number, element: HTMLElement, floorHeight: number) {
            this.id = id;
            this.currentFloor = 0;
            this.element = element!;
            this.floorHeight = floorHeight;
            this.destinations = [];
            this.inMotion = false; // Initialize inMotion flag to false
            this.elevatorSound = new Audio('ding.mp3');

        }

        playElevatorSound() {
            this.elevatorSound.play();

        }

        stopElevatorSound() {
            this.elevatorSound.pause();
            this.elevatorSound.currentTime = 0;
        }

        
        moveToFloor(targetFloor: number){
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
            let distanceToMove: number;
            if (targetFloor === 0) { 
                distanceToMove = 0;
            } else {
                distanceToMove = targetFloor * this.floorHeight;
            }

            // Calculate the duration of the movement
            let floorPressed = targetFloor;
            const speed = 110 / 0.5;
            const stop = 2000;
            let calculateDuration: number;
                if (floorPressed === 0){
                    calculateDuration = (this.currentFloor * this.floorHeight) / speed;
                } else {
                    calculateDuration = Math.abs((this.currentFloor - floorPressed) * this.floorHeight) / speed; 
                }
            
            console.log(`Moving from floor ${this.currentFloor} to floor ${targetFloor}`);
            this.inMotion = true; 
            this.animateMovement(distanceToMove);
            this.currentFloor = targetFloor;
            
            setTimeout(() => {
                console.log(`Elevator Reached The Floor`);
                this.playElevatorSound();
            }, ((calculateDuration * 1000)-500));
            

            setTimeout(() => {
                if (this.destinations.length > 0) {
                    console.log(`Elevator Goes To Next Destination`);
                }
                this.inMotion = false;
                this.processNextDestination();
                this.stopElevatorSound();
            }, (calculateDuration * 1000) + stop);
        }        

        public animateMovement(distanceToMove: number) {
            const speed = 110 / 0.5;
            const stop = 2000;
            let duration = Math.abs((this.currentFloor * this.floorHeight) - distanceToMove) / speed; 
            if (distanceToMove > 0) {
                this.element.style.transition = `transform ${duration}s ease`;
                console.log(`distanceToMove: ${distanceToMove}px. Duration: ${duration}s`)
                this.element.style.transform = `translateY(${-distanceToMove}px)`;
            } else {
                this.element.style.transition = `transform 0s ease`;
                console.log(`distanceToMove: ${distanceToMove}px. Duration: 0s`)
                this.element.style.transform = `translateY(0px)`;
            }
        }

    }

    class ElevatorController {
        elevators: Elevator[];
        floorHeight: number;

        constructor(numElevators: number, floorHeight: number) {
            this.floorHeight = floorHeight;
            this.elevators = [];

            // Initialize elevators
            for (let i = 0; i < numElevators; i++) {
                const elevatorElement = document.getElementById(`e${i}`)!;
                if (elevatorElement) {
                    const elevator = new Elevator(i, elevatorElement, floorHeight);
                    this.elevators.push(elevator);
                } else {
                    console.error(`Element with ID 'e${i}' not found.`);
                }
            }
        }

        callElevator(targetFloor: number) {
            // Find the elevator with the shortest queue in terms of time
            let shortestQueueIndex = 0;
            let shortestQueueTime = Infinity;
            for (let i = 0; i < this.elevators.length; i++) {
                const elevator = this.elevators[i];
                const timeToReachFloor = Math.abs(elevator.currentFloor - targetFloor) * 0.5; // Time to move from one floor to another
                const timeToServeQueue = elevator.destinations.reduce((acc, floor) => acc + Math.abs(floor - elevator.currentFloor), 0) * 2; // Time to serve existing queue
                const totalQueueTime = timeToReachFloor + timeToServeQueue;
                if (totalQueueTime < shortestQueueTime) {
                    shortestQueueTime = totalQueueTime;
                    shortestQueueIndex = i;
                }
            }

            // Add the target floor to the shortest queue
            const selectedElevator = this.elevators[shortestQueueIndex];
            selectedElevator.moveToFloor(targetFloor);
        }
    }
});
