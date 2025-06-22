The SOLID principles are a set of guidelines for designing software that aims to make it more maintainable, flexible, and easy to understand. The principles are named after the five initials of their respective concepts: Single Responsibility Principle (SRP), Open-Closed Principle (OCP), Liskov Substitution Principle (LSP), Interface Segregation Principle (ISP), and Dependency Inversion Principle (DIP). I'll explain each principle with simple examples and provide code snippets in TypeScript.

1. Single Responsibility Principle (SRP):
   This principle states that a class should have only one reason to change. In other words, a class should have a single responsibility or purpose.

Example: Consider a UserService class that handles user management, including registration and authentication.

```
class UserService {
  registerUser(username: string, password: string) {
    // Registration logic
  }

  authenticateUser(username: string, password: string) {
    // Authentication logic
  }
}
```

In this example, the UserService has a single responsibility of managing user-related operations.

2. Open-Closed Principle (OCP):
   This principle states that software entities (classes, modules, etc.) should be open for extension but closed for modification. In other words, you should be able to add new functionality without modifying existing code.

Example: Suppose we have a Shape class and want to calculate the area of different shapes. Instead of modifying the Shape class whenever a new shape is added, we can follow the OCP by introducing a separate class for each shape.

```

abstract class Shape {
  abstract calculateArea(): number;
}

class Rectangle extends Shape {
  width: number;
  height: number;

  calculateArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  radius: number;

  calculateArea() {
    return Math.PI * this.radius * this.radius;
  }
}

```

Now, we can add new shapes by creating classes that extend the Shape class without modifying existing code.

3. Liskov Substitution Principle (LSP):
   This principle states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.

Example: Suppose we have a Bird superclass and two subclasses Sparrow and Ostrich. The LSP states that we should be able to use a Sparrow or Ostrich wherever a Bird is expected.

```
class Bird {
  fly() {
    // Fly logic
  }
}

class Sparrow extends Bird {
  fly() {
    // Sparrow's specific fly logic
  }
}

class Ostrich extends Bird {
  fly() {
    throw new Error("Ostrich cannot fly");
  }
}
```

Although the Ostrich class does not implement the fly method, it adheres to the LSP by substituting the Bird class and providing appropriate behavior.


4. Interface Segregation Principle (ISP):
This principle states that clients should not be forced to depend on interfaces they do not use. It means that classes should not be forced to implement interfaces that contain methods they don't need.


```
// Bad example violating ISP
interface Printer {
  print(): void;
  scan(): void;
  fax(): void;
}

class AllInOnePrinter implements Printer {
  public print() {
    // Code to print
  }

  public scan() {
    // Code to scan
  }

  public fax() {
    // Code to fax
  }
}

class SimplePrinter implements Printer {
  public print() {
    // Code to print
  }

  public scan() {
    // This method is not needed for SimplePrinter
    throw new Error('Method not supported');
  }

  public fax() {
    // This method is not needed for SimplePrinter
    throw new Error('Method not supported');
  }
}

// Good example following ISP
interface Printer {
  print(): void;
}

interface Scanner {
  scan(): void;
}

interface FaxMachine {
  fax(): void;
}

class AllInOnePrinter implements Printer, Scanner, FaxMachine {
  public print() {
    // Code to print
  }

  public scan() {
    // Code to scan
  }

  public fax() {
    // Code to fax
  }
}

class SimplePrinter implements Printer {
  public print() {
    // Code to print
  }
}
```
5. Dependency Inversion Principle:

```
// Define the data types
interface User {
    id?: number;
    name: string;
    email: string;
}

// Database interface (abstraction)
interface Database {
    save(data: User): Promise<User>;
    findById(id: number): Promise<User | null>;
    update(id: number, data: Partial<User>): Promise<User>;
    delete(id: number): Promise<boolean>;
}

// MySQL Implementation
class MySQLDatabase implements Database {
    private connection: any; // In real code, use proper MySQL client type

    constructor() {
        // Initialize MySQL connection
        this.connection = {
            /* MySQL connection setup */
        };
    }

    async save(data: User): Promise<User> {
        try {
            // Simulated MySQL query
            const query = `INSERT INTO users (name, email) VALUES (?, ?)`;
            const result = await this.connection.query(query, [data.name, data.email]);
            return { ...data, id: result.insertId };
        } catch (error) {
            throw new Error(`MySQL Save Error: ${error.message}`);
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            const query = `SELECT * FROM users WHERE id = ?`;
            const [user] = await this.connection.query(query, [id]);
            return user || null;
        } catch (error) {
            throw new Error(`MySQL Find Error: ${error.message}`);
        }
    }

    async update(id: number, data: Partial<User>): Promise<User> {
        try {
            const query = `UPDATE users SET ? WHERE id = ?`;
            await this.connection.query(query, [data, id]);
            return this.findById(id);
        } catch (error) {
            throw new Error(`MySQL Update Error: ${error.message}`);
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM users WHERE id = ?`;
            const result = await this.connection.query(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`MySQL Delete Error: ${error.message}`);
        }
    }
}

// MongoDB Implementation
class MongoDatabase implements Database {
    private collection: any; // In real code, use proper MongoDB collection type

    constructor() {
        // Initialize MongoDB connection
        this.collection = {
            /* MongoDB collection setup */
        };
    }

    async save(data: User): Promise<User> {
        try {
            const result = await this.collection.insertOne(data);
            return { ...data, id: result.insertedId };
        } catch (error) {
            throw new Error(`MongoDB Save Error: ${error.message}`);
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            return await this.collection.findOne({ _id: id });
        } catch (error) {
            throw new Error(`MongoDB Find Error: ${error.message}`);
        }
    }

    async update(id: number, data: Partial<User>): Promise<User> {
        try {
            await this.collection.updateOne(
                { _id: id },
                { $set: data }
            );
            return this.findById(id);
        } catch (error) {
            throw new Error(`MongoDB Update Error: ${error.message}`);
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const result = await this.collection.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            throw new Error(`MongoDB Delete Error: ${error.message}`);
        }
    }
}

// User Service that depends on the abstraction
class UserService {
    constructor(private database: Database) {}

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        try {
            return await this.database.save(userData);
        } catch (error) {
            throw new Error(`Create User Error: ${error.message}`);
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            return await this.database.findById(id);
        } catch (error) {
            throw new Error(`Get User Error: ${error.message}`);
        }
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        try {
            return await this.database.update(id, userData);
        } catch (error) {
            throw new Error(`Update User Error: ${error.message}`);
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            return await this.database.delete(id);
        } catch (error) {
            throw new Error(`Delete User Error: ${error.message}`);
        }
    }
}

// Usage example
async function main() {
    // Can easily switch between MySQL and MongoDB
    const mysqlDb = new MySQLDatabase();
    const mongoDb = new MongoDatabase();

    // Using MySQL
    const userServiceWithMySQL = new UserService(mysqlDb);
    
    // Using MongoDB
    const userServiceWithMongo = new UserService(mongoDb);

    try {
        // Create a new user
        const newUser = await userServiceWithMySQL.createUser({
            name: "John Doe",
            email: "john@example.com"
        });
        console.log('Created user:', newUser);

        // Get user by ID
        const user = await userServiceWithMySQL.getUserById(newUser.id);
        console.log('Found user:', user);

        // Update user
        const updatedUser = await userServiceWithMySQL.updateUser(newUser.id, {
            name: "John Smith"
        });
        console.log('Updated user:', updatedUser);

        // Delete user
        const isDeleted = await userServiceWithMySQL.deleteUser(newUser.id);
        console.log('User deleted:', isDeleted);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```


## More

[LisKov](./liskov.md)


