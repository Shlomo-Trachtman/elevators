export interface BuildingElement {
    id: number;
    element: HTMLElement;
}

export class BuildingElementFactory {
    static createBuildingElement(id: number, elementId: string): BuildingElement {
        const element = document.getElementById(elementId)!;
        return { id, element };
    }
}

