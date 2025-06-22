/**
 * Open-Closed Principle (OCP)
 *
 * Software entities should be open for extension but closed for modification.
 * You should be able to add new functionality without changing existing code.
 */

// ❌ BAD: Violating OCP - Need to modify AreaCalculator for each new shape
class AreaCalculatorBad {
  calculateArea(shapes: any[]): number {
    let totalArea = 0;

    for (const shape of shapes) {
      if (shape.type === "rectangle") {
        totalArea += shape.width * shape.height;
      } else if (shape.type === "circle") {
        totalArea += Math.PI * shape.radius * shape.radius;
      } else if (shape.type === "triangle") {
        // Need to modify this class!
        totalArea += 0.5 * shape.base * shape.height;
      }
      // Adding new shapes requires modifying this method!
    }

    return totalArea;
  }
}

// ✅ GOOD: Following OCP - Open for extension, closed for modification

// Abstract base class defining the contract
abstract class Shape {
  abstract calculateArea(): number;
  abstract getPerimeter(): number;
  abstract getName(): string;
}

// Rectangle implementation
class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  getName(): string {
    return "Rectangle";
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}

// Circle implementation
class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  getName(): string {
    return "Circle";
  }

  getRadius(): number {
    return this.radius;
  }
}

// Triangle implementation - NEW shape without modifying existing code
class Triangle extends Shape {
  constructor(
    private base: number,
    private height: number,
    private sideA: number,
    private sideB: number
  ) {
    super();
  }

  calculateArea(): number {
    return 0.5 * this.base * this.height;
  }

  getPerimeter(): number {
    return this.base + this.sideA + this.sideB;
  }

  getName(): string {
    return "Triangle";
  }
}

// Pentagon implementation - Another NEW shape
class Pentagon extends Shape {
  constructor(private side: number) {
    super();
  }

  calculateArea(): number {
    // Regular pentagon area formula
    return (1 / 4) * Math.sqrt(25 + 10 * Math.sqrt(5)) * this.side * this.side;
  }

  getPerimeter(): number {
    return 5 * this.side;
  }

  getName(): string {
    return "Pentagon";
  }
}

// The calculator doesn't need to change when new shapes are added
class AreaCalculator {
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }

  calculateTotalPerimeter(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.getPerimeter(), 0);
  }

  getShapeReport(shapes: Shape[]): string {
    const report = shapes.map(
      (shape) =>
        `${shape.getName()}: Area = ${shape
          .calculateArea()
          .toFixed(2)}, Perimeter = ${shape.getPerimeter().toFixed(2)}`
    );
    return report.join("\n");
  }
}

// More advanced example: Discount calculation system
abstract class DiscountStrategy {
  abstract calculateDiscount(amount: number): number;
  abstract getName(): string;
}

class NoDiscount extends DiscountStrategy {
  calculateDiscount(amount: number): number {
    return 0;
  }

  getName(): string {
    return "No Discount";
  }
}

class PercentageDiscount extends DiscountStrategy {
  constructor(private percentage: number) {
    super();
  }

  calculateDiscount(amount: number): number {
    return amount * (this.percentage / 100);
  }

  getName(): string {
    return `${this.percentage}% Discount`;
  }
}

class FixedAmountDiscount extends DiscountStrategy {
  constructor(private discountAmount: number) {
    super();
  }

  calculateDiscount(amount: number): number {
    return Math.min(this.discountAmount, amount);
  }

  getName(): string {
    return `$${this.discountAmount} Off`;
  }
}

// NEW discount type - can be added without modifying existing code
class BuyOneGetOneDiscount extends DiscountStrategy {
  calculateDiscount(amount: number): number {
    return amount * 0.5; // 50% off for BOGO
  }

  getName(): string {
    return "Buy One Get One Free";
  }
}

// NEW discount type - seasonal discount
class SeasonalDiscount extends DiscountStrategy {
  constructor(private seasonMultiplier: number) {
    super();
  }

  calculateDiscount(amount: number): number {
    const baseDiscount = amount * 0.1; // 10% base
    return baseDiscount * this.seasonMultiplier;
  }

  getName(): string {
    return `Seasonal Discount (${this.seasonMultiplier}x)`;
  }
}

// Price calculator that works with any discount strategy
class PriceCalculator {
  calculateFinalPrice(
    originalAmount: number,
    discountStrategy: DiscountStrategy
  ): number {
    const discount = discountStrategy.calculateDiscount(originalAmount);
    return originalAmount - discount;
  }

  getPriceBreakdown(
    originalAmount: number,
    discountStrategy: DiscountStrategy
  ): object {
    const discount = discountStrategy.calculateDiscount(originalAmount);
    const finalPrice = originalAmount - discount;

    return {
      originalAmount,
      discountType: discountStrategy.getName(),
      discountAmount: discount,
      finalPrice,
      savingsPercentage: ((discount / originalAmount) * 100).toFixed(2) + "%",
    };
  }
}

// Usage examples
function demonstrateOCP() {
  // Shape example
  const shapes: Shape[] = [
    new Rectangle(5, 4),
    new Circle(3),
    new Triangle(6, 4, 5, 5),
    new Pentagon(3),
  ];

  const areaCalculator = new AreaCalculator();

  console.log("=== Shape Calculations ===");
  console.log(
    `Total Area: ${areaCalculator.calculateTotalArea(shapes).toFixed(2)}`
  );
  console.log(
    `Total Perimeter: ${areaCalculator
      .calculateTotalPerimeter(shapes)
      .toFixed(2)}`
  );
  console.log("\n=== Shape Report ===");
  console.log(areaCalculator.getShapeReport(shapes));

  // Discount example
  const originalPrice = 100;
  const discountStrategies: DiscountStrategy[] = [
    new NoDiscount(),
    new PercentageDiscount(20),
    new FixedAmountDiscount(15),
    new BuyOneGetOneDiscount(),
    new SeasonalDiscount(1.5),
  ];

  const priceCalculator = new PriceCalculator();

  console.log("\n=== Discount Calculations ===");
  discountStrategies.forEach((strategy) => {
    const breakdown = priceCalculator.getPriceBreakdown(
      originalPrice,
      strategy
    );
    console.log(
      `${strategy.getName()}: $${(breakdown as any).finalPrice.toFixed(2)} (${
        (breakdown as any).savingsPercentage
      } savings)`
    );
  });
}

// Benefits of following OCP:
// 1. Can add new shapes without modifying AreaCalculator
// 2. Can add new discount strategies without modifying PriceCalculator
// 3. Existing code remains stable and tested
// 4. Easier to maintain and extend
// 5. Follows the principle of code being closed for modification but open for extension

export {
  Shape,
  Rectangle,
  Circle,
  Triangle,
  Pentagon,
  AreaCalculator,
  DiscountStrategy,
  PercentageDiscount,
  FixedAmountDiscount,
  BuyOneGetOneDiscount,
  SeasonalDiscount,
  PriceCalculator,
  demonstrateOCP,
};
