import { Elevator } from './elevator';

export class ElevatorController {
    private elevators: Elevator[];

    constructor(elevatorCount: number, floorHeight: number) {
        this.elevators = [];
        for (let i = 0; i < elevatorCount; i++) {
            const elementId = `e${i}`;
            this.elevators.push(ElevatorFactory.createElevator(i, `e${i + 1}`, floorHeight));
        }
    }

    public dispatchElevator(targetFloor: number) {
        let closestElevator = this.elevators[0];
        let minimumDistance = 110;

        this.elevators.forEach(elevator => {
            let distance = Math.abs(elevator.currentFloor - targetFloor);
            if (distance < minimumDistance) {
                closestElevator = elevator;
                minimumDistance = distance;
            }
        });
    }

    //Find closest elevator and call it
    callElevator(targetFloor: number) {
        let closestElevator = this.elevators.reduce((prev, curr) =>
            Math.abs(curr.currentFloor - targetFloor) < Math.abs(prev.currentFloor - targetFloor) ? curr : prev
        );

        // Check if the closest elevator already on target floor
        if (closestElevator.currentFloor === targetFloor) {
            return;
        }

        closestElevator.moveToFloor(targetFloor);
    }
}

