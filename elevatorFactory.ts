import { Elevator } from './elevator';
import { BuildingElementFactory } from './buildingElementFactory';

export class ElevatorFactory {
    static createElevator(id: number, elementId: string, floorHeight: number): Elevator {
        const buildingElement = BuildingElementFactory.createBuildingElement(id, elementId);
        return new Elevator(buildingElement.id, buildingElement.element, floorHeight);
    }
}

