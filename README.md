 Elevator Project Overview

The project features an elevator control system implemented in TypeScript, utilizing a modular and object-oriented architecture. The architecture comprises several key components, each serving a specific role in managing the elevator system.

1. Main Components:
   - The main components of the architecture include Elevator, ElevatorController, ElevatorFactory, and Building classes.

2. Elevator Class:
   - Represents individual elevator units.
   - Manages elevator state, such as current floor, destinations, and motion.
   - Handles elevator movement, destination management, and animation.

3. ElevatorController Class:
   - Acts as the central controller for managing multiple elevators.
   - Orchestrates elevator operations, such as dispatching requests and coordinating movements.
   - Determines the closest available elevator to handle new requests efficiently.

4. ElevatorFactory Class:
   - Facilitates the creation of elevator instances.
   - Abstracts the creation process to promote modularity and flexibility.
   - Initializes elevator objects with the necessary parameters.

5. Building Class:
   - Represents a building structure.
   - Handles building-specific functionalities, such as floor creation and elevator initialization.
   - Maintains a clear separation of concerns by encapsulating building-related logic.

6. Main Algorithm:
   - The primary algorithm efficiently dispatches elevators to handle floor requests.
   - When a new call is made, the system examines the length of all elevator queues.
   - The algorithm chooses the elevator with the shortest queue to handle the new call, ensuring optimal elevator allocation.

Unimplemented Requirements:
1. Changing the background color of the button from the moment the elevator is summoned until its arrival.
2. Flexible encoding of elements and the structure of `index.html` through user input.

Issues in the Code:
Algorithm:
The algorithm currently implemented is not efficient enough, because it calculates the nearest elevator in terms of physical distance. A more efficient algorithm would compute the closest elevator in terms of time distance. At this stage, it has not been implemented.

Code Structure:
The code structure is not sufficiently modular and does not fully adhere to the Single Responsibility Principle.
