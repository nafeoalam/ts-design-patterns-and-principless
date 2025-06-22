/**
 * Liskov Substitution Principle (LSP)
 *
 * Objects of a superclass should be replaceable with objects of its subclasses
 * without affecting the correctness of the program.
 *
 * If S is a subtype of T, then objects of type T may be replaced with objects of type S.
 */

// ❌ BAD: Violating LSP
class BirdBad {
  fly(): void {
    console.log("Flying in the air");
  }
}

class SparrowBad extends BirdBad {
  fly(): void {
    console.log("Sparrow flying quickly");
  }
}

class OstrichBad extends BirdBad {
  fly(): void {
    // Ostrich cannot fly! This violates LSP
    throw new Error("Ostrich cannot fly");
  }
}

// This function expects all birds to be able to fly
function makeBirdFlyBad(bird: BirdBad): void {
  bird.fly(); // This will throw an error for Ostrich!
}

// ✅ GOOD: Following LSP - Proper abstraction

// Base interface for all birds
interface Bird {
  eat(): void;
  makeSound(): void;
}

// Separate interface for flying capability
interface FlyingBird extends Bird {
  fly(): void;
}

// Separate interface for running capability
interface RunningBird extends Bird {
  run(): void;
}

// Sparrow can fly
class Sparrow implements FlyingBird {
  eat(): void {
    console.log("Sparrow eating seeds");
  }

  makeSound(): void {
    console.log("Chirp chirp!");
  }

  fly(): void {
    console.log("Sparrow flying quickly through the air");
  }
}

// Eagle can fly
class Eagle implements FlyingBird {
  eat(): void {
    console.log("Eagle hunting prey");
  }

  makeSound(): void {
    console.log("Screech!");
  }

  fly(): void {
    console.log("Eagle soaring majestically");
  }
}

// Ostrich cannot fly but can run
class Ostrich implements RunningBird {
  eat(): void {
    console.log("Ostrich eating plants");
  }

  makeSound(): void {
    console.log("Boom boom!");
  }

  run(): void {
    console.log("Ostrich running very fast on the ground");
  }
}

// Penguin cannot fly but can swim
interface SwimmingBird extends Bird {
  swim(): void;
}

class Penguin implements SwimmingBird {
  eat(): void {
    console.log("Penguin eating fish");
  }

  makeSound(): void {
    console.log("Honk honk!");
  }

  swim(): void {
    console.log("Penguin swimming gracefully underwater");
  }
}

// Functions that work with specific bird capabilities
function makeFlyingBirdFly(bird: FlyingBird): void {
  bird.fly(); // Safe - all FlyingBird implementations can fly
}

function makeRunningBirdRun(bird: RunningBird): void {
  bird.run(); // Safe - all RunningBird implementations can run
}

function makeSwimmingBirdSwim(bird: SwimmingBird): void {
  bird.swim(); // Safe - all SwimmingBird implementations can swim
}

// Function that works with any bird
function feedBird(bird: Bird): void {
  bird.eat(); // Safe - all birds can eat
  bird.makeSound(); // Safe - all birds can make sound
}

// More complex example: Vehicle hierarchy

// ❌ BAD: Violating LSP
abstract class VehicleBad {
  abstract startEngine(): void;
  abstract accelerate(): void;
  abstract refuel(): void; // Problem: Electric vehicles don't refuel!
}

class CarBad extends VehicleBad {
  startEngine(): void {
    console.log("Starting gas engine");
  }

  accelerate(): void {
    console.log("Car accelerating");
  }

  refuel(): void {
    console.log("Refueling with gasoline");
  }
}

class ElectricCarBad extends VehicleBad {
  startEngine(): void {
    console.log("Starting electric motor");
  }

  accelerate(): void {
    console.log("Electric car accelerating silently");
  }

  refuel(): void {
    // This violates LSP!
    throw new Error("Electric cars do not refuel, they recharge!");
  }
}

// ✅ GOOD: Following LSP
abstract class Vehicle {
  abstract start(): void;
  abstract accelerate(): void;
  abstract stop(): void;
}

// Interface for vehicles that need fuel
interface FuelVehicle {
  refuel(): void;
  getFuelLevel(): number;
}

// Interface for vehicles that need charging
interface ElectricVehicle {
  recharge(): void;
  getBatteryLevel(): number;
}

class Car extends Vehicle implements FuelVehicle {
  private fuelLevel: number = 100;

  start(): void {
    console.log("Starting gas engine");
  }

  accelerate(): void {
    console.log("Car accelerating with engine power");
    this.fuelLevel -= 1;
  }

  stop(): void {
    console.log("Car stopping");
  }

  refuel(): void {
    console.log("Refueling with gasoline");
    this.fuelLevel = 100;
  }

  getFuelLevel(): number {
    return this.fuelLevel;
  }
}

class ElectricCar extends Vehicle implements ElectricVehicle {
  private batteryLevel: number = 100;

  start(): void {
    console.log("Starting electric motor");
  }

  accelerate(): void {
    console.log("Electric car accelerating silently");
    this.batteryLevel -= 2;
  }

  stop(): void {
    console.log("Electric car stopping with regenerative braking");
    this.batteryLevel += 1; // Regenerative braking
  }

  recharge(): void {
    console.log("Recharging battery");
    this.batteryLevel = 100;
  }

  getBatteryLevel(): number {
    return this.batteryLevel;
  }
}

class Bicycle extends Vehicle {
  start(): void {
    console.log("Ready to pedal");
  }

  accelerate(): void {
    console.log("Pedaling faster");
  }

  stop(): void {
    console.log("Stopping bicycle");
  }
}

// Hybrid vehicle that implements both interfaces
class HybridCar extends Vehicle implements FuelVehicle, ElectricVehicle {
  private fuelLevel: number = 100;
  private batteryLevel: number = 100;

  start(): void {
    console.log("Starting hybrid system");
  }

  accelerate(): void {
    console.log("Hybrid car accelerating efficiently");
    this.fuelLevel -= 0.5;
    this.batteryLevel -= 1;
  }

  stop(): void {
    console.log("Hybrid car stopping");
  }

  refuel(): void {
    console.log("Refueling hybrid car");
    this.fuelLevel = 100;
  }

  getFuelLevel(): number {
    return this.fuelLevel;
  }

  recharge(): void {
    console.log("Recharging hybrid battery");
    this.batteryLevel = 100;
  }

  getBatteryLevel(): number {
    return this.batteryLevel;
  }
}

// Functions that work with vehicles following LSP
function operateVehicle(vehicle: Vehicle): void {
  vehicle.start();
  vehicle.accelerate();
  vehicle.stop();
  // This works with ANY vehicle type without issues
}

function maintainFuelVehicle(vehicle: FuelVehicle): void {
  if (vehicle.getFuelLevel() < 20) {
    vehicle.refuel();
  }
}

function maintainElectricVehicle(vehicle: ElectricVehicle): void {
  if (vehicle.getBatteryLevel() < 20) {
    vehicle.recharge();
  }
}

// Generic maintenance function
function performMaintenance(vehicle: Vehicle): void {
  console.log(`Performing maintenance on vehicle`);

  // Type-safe checks for specific capabilities
  if ("refuel" in vehicle && "getFuelLevel" in vehicle) {
    maintainFuelVehicle(vehicle as FuelVehicle);
  }

  if ("recharge" in vehicle && "getBatteryLevel" in vehicle) {
    maintainElectricVehicle(vehicle as ElectricVehicle);
  }
}

// Usage example
function demonstrateLSP(): void {
  console.log("=== Bird Example ===");
  const birds: Bird[] = [
    new Sparrow(),
    new Eagle(),
    new Ostrich(),
    new Penguin(),
  ];

  // All birds can eat and make sound
  birds.forEach((bird) => {
    feedBird(bird); // Works for all birds
  });

  // Only flying birds can fly
  const flyingBirds: FlyingBird[] = [new Sparrow(), new Eagle()];
  flyingBirds.forEach((bird) => makeFlyingBirdFly(bird));

  // Only running birds can run
  const runningBirds: RunningBird[] = [new Ostrich()];
  runningBirds.forEach((bird) => makeRunningBirdRun(bird));

  console.log("\n=== Vehicle Example ===");
  const vehicles: Vehicle[] = [
    new Car(),
    new ElectricCar(),
    new Bicycle(),
    new HybridCar(),
  ];

  // All vehicles can be operated the same way
  vehicles.forEach((vehicle) => {
    operateVehicle(vehicle); // Works for all vehicles
    performMaintenance(vehicle);
    console.log("---");
  });
}

// Benefits of following LSP:
// 1. Substitutability - any subclass can replace its parent class
// 2. Predictable behavior - no unexpected exceptions or behaviors
// 3. Proper abstraction - interfaces represent actual capabilities
// 4. Better design - forces you to think about what objects can actually do
// 5. More maintainable code - adding new types doesn't break existing functionality

export {
  Bird,
  FlyingBird,
  RunningBird,
  SwimmingBird,
  Sparrow,
  Eagle,
  Ostrich,
  Penguin,
  Vehicle,
  FuelVehicle,
  ElectricVehicle,
  Car,
  ElectricCar,
  Bicycle,
  HybridCar,
  demonstrateLSP,
};
