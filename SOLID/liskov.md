The Liskov Substitution Principle (LSP) is a fundamental principle in object-oriented programming that defines the relationship between a superclass and its subclasses. It states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program. In other words, a subclass should be able to be used in place of its superclass without causing any unexpected behavior or breaking the code.

To understand the LSP better, let's consider an example involving shapes. Suppose we have a Shape superclass and two subclasses, Rectangle and Square. The Shape class has a method called calculateArea() that calculates the area of the shape.

```

class Shape {
  calculateArea(): number {
    // Calculate area logic
  }
}

class Rectangle extends Shape {
  width: number;
  height: number;
}

class Square extends Shape {
  sideLength: number;
}
```
According to the LSP, we should be able to use a Rectangle or a Square wherever a Shape is expected, without causing any issues. Let's see an example:

typescript
```
function printArea(shape: Shape) {
  const area = shape.calculateArea();
  console.log(`The area is: ${area}`);
}

const rectangle = new Rectangle();
rectangle.width = 4;
rectangle.height = 6;

const square = new Square();
square.sideLength = 5;

printArea(rectangle); // Output: The area is: 24
printArea(square); // Output: The area is: 25
```
In this example, both the Rectangle and Square objects can be passed to the printArea function, which expects a Shape object. The LSP guarantees that the program will behave correctly because the Rectangle and Square subclasses inherit the calculateArea() method from the Shape superclass.

However, if the LSP is violated, unexpected behavior can occur. Let's modify the Square class to violate the LSP:

```

class Square extends Shape {
  sideLength: number;

  calculateArea(): number {
    return this.sideLength * this.sideLength;
  }
}
```
In this modified version, we override the calculateArea() method in the Square class to calculate the area of a square using the side length instead of the width and height. This violates the LSP because a square is a specific type of rectangle, and replacing a Rectangle object with a Square object can lead to incorrect results when calculating the area.

By adhering to the LSP, we ensure that our code remains robust and maintainable, as subclasses can be used interchangeably with their superclasses without introducing unexpected behavior or breaking existing code.


```
// Base Shape class with abstract method
abstract class Shape {
    abstract calculateArea(): number;
}

// Rectangle implementation
class Rectangle extends Shape {
    constructor(protected width: number, protected height: number) {
        super();
    }

    setWidth(width: number): void {
        this.width = width;
    }

    setHeight(height: number): void {
        this.height = height;
    }

    calculateArea(): number {
        return this.width * this.height;
    }
}

// Square implementation
class Square extends Shape {
    constructor(private sideLength: number) {
        super();
    }

    setSideLength(length: number): void {
        this.sideLength = length;
    }

    calculateArea(): number {
        return this.sideLength * this.sideLength;
    }
}

// Usage example
function printArea(shape: Shape) {
    console.log(`Area: ${shape.calculateArea()}`);
}

// Test the implementation
const rectangle = new Rectangle(4, 5);
const square = new Square(5);

printArea(rectangle); // Output: Area: 20
printArea(square);    // Output: Area: 25
```