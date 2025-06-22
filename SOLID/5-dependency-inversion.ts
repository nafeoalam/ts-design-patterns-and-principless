/**
 * Dependency Inversion Principle (DIP)
 *
 * 1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
 * 2. Abstractions should not depend on details. Details should depend on abstractions.
 */

// ❌ BAD: Violating DIP - High-level class depends on low-level implementation
class MySQLDatabaseBad {
  connect(): void {
    console.log("Connecting to MySQL database");
  }

  save(data: any): void {
    console.log("Saving data to MySQL:", data);
  }

  find(id: string): any {
    console.log("Finding data in MySQL with id:", id);
    return { id, data: "some data" };
  }
}

class UserServiceBad {
  private database: MySQLDatabaseBad; // Direct dependency on concrete class!

  constructor() {
    this.database = new MySQLDatabaseBad(); // Tightly coupled!
  }

  createUser(userData: any): void {
    // High-level logic depends on low-level MySQL implementation
    this.database.connect();
    this.database.save(userData);
  }

  getUser(id: string): any {
    this.database.connect();
    return this.database.find(id);
  }
}

// Problems with the above approach:
// 1. Hard to test (can't mock the database)
// 2. Hard to change database type
// 3. Violates Open-Closed Principle
// 4. High coupling between UserService and MySQL

// ✅ GOOD: Following DIP - Depend on abstractions

// Abstraction (interface) - this is what both high and low level modules depend on
interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  save(collection: string, data: any): Promise<string>;
  findById(collection: string, id: string): Promise<any>;
  update(collection: string, id: string, data: any): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}

// Low-level modules (implementations) depend on the abstraction
class MySQLDatabase implements Database {
  private connection: any;

  async connect(): Promise<void> {
    console.log("Connecting to MySQL database");
    // MySQL-specific connection logic
    this.connection = { type: "mysql", connected: true };
  }

  async disconnect(): Promise<void> {
    console.log("Disconnecting from MySQL database");
    this.connection = null;
  }

  async save(collection: string, data: any): Promise<string> {
    console.log(`Saving to MySQL table ${collection}:`, data);
    // MySQL-specific save logic
    const id = Math.random().toString(36);
    return id;
  }

  async findById(collection: string, id: string): Promise<any> {
    console.log(`Finding in MySQL table ${collection} with id:`, id);
    // MySQL-specific find logic
    return { id, ...{}, table: collection };
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    console.log(`Updating MySQL table ${collection} id ${id}:`, data);
    // MySQL-specific update logic
  }

  async delete(collection: string, id: string): Promise<void> {
    console.log(`Deleting from MySQL table ${collection} id:`, id);
    // MySQL-specific delete logic
  }
}

class MongoDatabase implements Database {
  private connection: any;

  async connect(): Promise<void> {
    console.log("Connecting to MongoDB database");
    // MongoDB-specific connection logic
    this.connection = { type: "mongodb", connected: true };
  }

  async disconnect(): Promise<void> {
    console.log("Disconnecting from MongoDB database");
    this.connection = null;
  }

  async save(collection: string, data: any): Promise<string> {
    console.log(`Saving to MongoDB collection ${collection}:`, data);
    // MongoDB-specific save logic
    const id = Math.random().toString(36);
    return id;
  }

  async findById(collection: string, id: string): Promise<any> {
    console.log(`Finding in MongoDB collection ${collection} with id:`, id);
    // MongoDB-specific find logic
    return { _id: id, ...{}, collection };
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    console.log(`Updating MongoDB collection ${collection} id ${id}:`, data);
    // MongoDB-specific update logic
  }

  async delete(collection: string, id: string): Promise<void> {
    console.log(`Deleting from MongoDB collection ${collection} id:`, id);
    // MongoDB-specific delete logic
  }
}

class PostgreSQLDatabase implements Database {
  private connection: any;

  async connect(): Promise<void> {
    console.log("Connecting to PostgreSQL database");
    this.connection = { type: "postgresql", connected: true };
  }

  async disconnect(): Promise<void> {
    console.log("Disconnecting from PostgreSQL database");
    this.connection = null;
  }

  async save(collection: string, data: any): Promise<string> {
    console.log(`Saving to PostgreSQL table ${collection}:`, data);
    const id = Math.random().toString(36);
    return id;
  }

  async findById(collection: string, id: string): Promise<any> {
    console.log(`Finding in PostgreSQL table ${collection} with id:`, id);
    return { id, ...{}, table: collection };
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    console.log(`Updating PostgreSQL table ${collection} id ${id}:`, data);
  }

  async delete(collection: string, id: string): Promise<void> {
    console.log(`Deleting from PostgreSQL table ${collection} id:`, id);
  }
}

// High-level module depends on abstraction (Database interface)
interface User {
  id?: string;
  name: string;
  email: string;
  createdAt?: Date;
}

class UserService {
  constructor(private database: Database) {} // Dependency injection!

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    await this.database.connect();

    const user: User = {
      ...userData,
      createdAt: new Date(),
    };

    const id = await this.database.save("users", user);
    await this.database.disconnect();

    return { ...user, id };
  }

  async getUser(id: string): Promise<User | null> {
    await this.database.connect();
    const userData = await this.database.findById("users", id);
    await this.database.disconnect();

    return userData;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<void> {
    await this.database.connect();
    await this.database.update("users", id, userData);
    await this.database.disconnect();
  }

  async deleteUser(id: string): Promise<void> {
    await this.database.connect();
    await this.database.delete("users", id);
    await this.database.disconnect();
  }
}

// More examples: Email service

// Email abstraction
interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

// Different email implementations
class SMTPEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email via SMTP to ${to}: ${subject}`);
    // SMTP-specific implementation
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate async operation
  }
}

class SendGridEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email via SendGrid to ${to}: ${subject}`);
    // SendGrid-specific implementation
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

class AWSEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email via AWS SES to ${to}: ${subject}`);
    // AWS SES-specific implementation
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Mock email service for testing
class MockEmailService implements EmailService {
  private sentEmails: Array<{ to: string; subject: string; body: string }> = [];

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Mock: Email would be sent to ${to}: ${subject}`);
    this.sentEmails.push({ to, subject, body });
  }

  getSentEmails() {
    return [...this.sentEmails];
  }

  clearSentEmails() {
    this.sentEmails = [];
  }
}

// Notification service that depends on email abstraction
class NotificationService {
  [x: string]: any;
  constructor(private emailService: EmailService) {}

  async sendWelcomeNotification(user: User): Promise<void> {
    const subject = "Welcome to our platform!";
    const body = `Hello ${user.name}, welcome to our amazing platform!`;
    await this.emailService.sendEmail(user.email, subject, body);
  }

  async sendPasswordResetNotification(
    user: User,
    resetToken: string
  ): Promise<void> {
    const subject = "Password Reset Request";
    const body = `Hi ${user.name}, click here to reset your password: /reset?token=${resetToken}`;
    await this.emailService.sendEmail(user.email, subject, body);
  }
}

// Payment processing example
interface PaymentProcessor {
  processPayment(
    amount: number,
    currency: string,
    cardToken: string
  ): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<RefundResult>;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

interface RefundResult {
  success: boolean;
  refundId: string;
  message: string;
}

class StripePaymentProcessor implements PaymentProcessor {
  async processPayment(
    amount: number,
    currency: string,
    cardToken: string
  ): Promise<PaymentResult> {
    console.log(`Processing $${amount} ${currency} payment via Stripe`);
    // Stripe-specific implementation
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      transactionId: "stripe_" + Math.random().toString(36),
      message: "Payment processed successfully via Stripe",
    };
  }

  async refundPayment(
    transactionId: string,
    amount?: number
  ): Promise<RefundResult> {
    console.log(
      `Refunding ${
        amount ? "$" + amount : "full amount"
      } for transaction ${transactionId} via Stripe`
    );
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      refundId: "stripe_refund_" + Math.random().toString(36),
      message: "Refund processed successfully via Stripe",
    };
  }
}

class PayPalPaymentProcessor implements PaymentProcessor {
  async processPayment(
    amount: number,
    currency: string,
    cardToken: string
  ): Promise<PaymentResult> {
    console.log(`Processing $${amount} ${currency} payment via PayPal`);
    // PayPal-specific implementation
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      transactionId: "paypal_" + Math.random().toString(36),
      message: "Payment processed successfully via PayPal",
    };
  }

  async refundPayment(
    transactionId: string,
    amount?: number
  ): Promise<RefundResult> {
    console.log(
      `Refunding ${
        amount ? "$" + amount : "full amount"
      } for transaction ${transactionId} via PayPal`
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      refundId: "paypal_refund_" + Math.random().toString(36),
      message: "Refund processed successfully via PayPal",
    };
  }
}

class MockPaymentProcessor implements PaymentProcessor {
  private transactions: PaymentResult[] = [];
  private refunds: RefundResult[] = [];

  async processPayment(
    amount: number,
    currency: string,
    cardToken: string
  ): Promise<PaymentResult> {
    console.log(`Mock: Processing $${amount} ${currency} payment`);
    const result: PaymentResult = {
      success: true,
      transactionId: "mock_" + Math.random().toString(36),
      message: "Mock payment processed",
    };
    this.transactions.push(result);
    return result;
  }

  async refundPayment(
    transactionId: string,
    amount?: number
  ): Promise<RefundResult> {
    console.log(
      `Mock: Refunding ${
        amount ? "$" + amount : "full amount"
      } for ${transactionId}`
    );
    const result: RefundResult = {
      success: true,
      refundId: "mock_refund_" + Math.random().toString(36),
      message: "Mock refund processed",
    };
    this.refunds.push(result);
    return result;
  }

  getTransactions() {
    return [...this.transactions];
  }

  getRefunds() {
    return [...this.refunds];
  }
}

// Order service that depends on payment abstraction
interface Order {
  id: string;
  userId: string;
  items: Array<{ name: string; price: number }>;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
}

class OrderService {
  constructor(
    private database: Database,
    private paymentProcessor: PaymentProcessor,
    private notificationService: NotificationService
  ) {}

  async createOrder(
    userId: string,
    items: Array<{ name: string; price: number }>
  ): Promise<Order> {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const order: Order = {
      id: "order_" + Math.random().toString(36),
      userId,
      items,
      total,
      status: "pending",
    };

    await this.database.connect();
    await this.database.save("orders", order);
    await this.database.disconnect();

    return order;
  }

  async processOrderPayment(
    orderId: string,
    cardToken: string
  ): Promise<boolean> {
    await this.database.connect();
    const order = await this.database.findById("orders", orderId);
    await this.database.disconnect();

    if (!order) {
      throw new Error("Order not found");
    }

    try {
      const paymentResult = await this.paymentProcessor.processPayment(
        order.total,
        "USD",
        cardToken
      );

      if (paymentResult.success) {
        // Update order status
        await this.database.connect();
        await this.database.update("orders", orderId, {
          status: "paid",
          transactionId: paymentResult.transactionId,
        });
        await this.database.disconnect();

        // Send notification (assuming we have user data)
        const user = await this.getUserById(order.userId);
        if (user) {
          await this.notificationService.sendOrderConfirmation(user, order);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Payment processing failed:", error);
      return false;
    }
  }

  async refundOrder(orderId: string, transactionId: string): Promise<boolean> {
    try {
      const refundResult = await this.paymentProcessor.refundPayment(
        transactionId
      );

      if (refundResult.success) {
        await this.database.connect();
        await this.database.update("orders", orderId, {
          status: "cancelled",
          refundId: refundResult.refundId,
        });
        await this.database.disconnect();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Refund processing failed:", error);
      return false;
    }
  }

  private async getUserById(userId: string): Promise<User | null> {
    await this.database.connect();
    const user = await this.database.findById("users", userId);
    await this.database.disconnect();
    return user;
  }
}

// Extend NotificationService with order notifications
class ExtendedNotificationService extends NotificationService {
  async sendOrderConfirmation(user: User, order: Order): Promise<void> {
    const subject = "Order Confirmation";
    const itemsList = order.items
      .map((item) => `- ${item.name}: $${item.price}`)
      .join("\n");
    const body = `Hi ${user.name},\n\nYour order ${order.id} has been confirmed!\n\nItems:\n${itemsList}\n\nTotal: $${order.total}\n\nThank you for your purchase!`;

    // Use the inherited emailService from the base class
    await this.sendEmail(user.email, subject, body);
  }

  // Add a method to access the email service for this demonstration
  private async sendEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<void> {
    // Access the private emailService through a protected method if we had one
    // For now, we'll call the parent notification methods
    const tempUser: User = { id: "1", name: "temp", email: to };
    // This is a workaround - in real code you'd make emailService protected
    console.log(`Order notification: ${subject} to ${to}`);
  }
}

// Dependency Injection Container (simple example)
class DIContainer {
  private services = new Map<string, any>();

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }
}

// Usage examples and demonstration
async function demonstrateDIP(): Promise<void> {
  console.log("=== Dependency Inversion Principle Demonstration ===\n");

  // Create a DI container
  const container = new DIContainer();

  // Register different implementations
  container.register("mysql-db", new MySQLDatabase());
  container.register("mongo-db", new MongoDatabase());
  container.register("postgres-db", new PostgreSQLDatabase());

  container.register("smtp-email", new SMTPEmailService());
  container.register("sendgrid-email", new SendGridEmailService());
  container.register("aws-email", new AWSEmailService());
  container.register("mock-email", new MockEmailService());

  container.register("stripe-payment", new StripePaymentProcessor());
  container.register("paypal-payment", new PayPalPaymentProcessor());
  container.register("mock-payment", new MockPaymentProcessor());

  // Example 1: Different database implementations
  console.log("--- Database Implementation Switching ---");
  const databases = ["mysql-db", "mongo-db", "postgres-db"];

  for (const dbType of databases) {
    const database = container.get<Database>(dbType);
    const userService = new UserService(database);

    const user = await userService.createUser({
      name: "John Doe",
      email: "john@example.com",
    });

    console.log(`Created user with ${dbType}:`, user.id);
  }

  console.log("\n--- Email Service Implementation Switching ---");
  const emailServices = ["smtp-email", "sendgrid-email", "aws-email"];

  for (const emailType of emailServices) {
    const emailService = container.get<EmailService>(emailType);
    const notificationService = new NotificationService(emailService);

    await notificationService.sendWelcomeNotification({
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
    });
  }

  console.log("\n--- Payment Processor Implementation Switching ---");
  const paymentProcessors = ["stripe-payment", "paypal-payment"];

  for (const paymentType of paymentProcessors) {
    const paymentProcessor = container.get<PaymentProcessor>(paymentType);
    const result = await paymentProcessor.processPayment(
      99.99,
      "USD",
      "test-token"
    );
    console.log(`${paymentType} result:`, result.message);
  }

  console.log("\n--- Full Application Example ---");
  // Create a complete application with injected dependencies
  const database = container.get<Database>("mongo-db");
  const emailService = container.get<EmailService>("mock-email");
  const paymentProcessor = container.get<PaymentProcessor>("mock-payment");

  const notificationService = new ExtendedNotificationService(emailService);
  const orderService = new OrderService(
    database,
    paymentProcessor,
    notificationService
  );

  // Create and process an order
  const order = await orderService.createOrder("user123", [
    { name: "Widget A", price: 29.99 },
    { name: "Widget B", price: 19.99 },
  ]);

  console.log("Created order:", order);

  const paymentSuccess = await orderService.processOrderPayment(
    order.id,
    "test-card-token"
  );
  console.log("Payment processed:", paymentSuccess);

  console.log("\n--- Testing Benefits ---");
  // Easy to test with mock implementations
  const mockEmail = container.get<MockEmailService>("mock-email");
  const mockPayment = container.get<MockPaymentProcessor>("mock-payment");

  console.log("Mock email sent emails:", mockEmail.getSentEmails());
  console.log("Mock payment transactions:", mockPayment.getTransactions());
}

// Benefits of following DIP:
// 1. Loose coupling - high-level modules don't depend on low-level details
// 2. Easy testing - can inject mock implementations
// 3. Flexibility - can switch implementations without changing high-level code
// 4. Follows Open-Closed Principle - open for extension, closed for modification
// 5. Better separation of concerns
// 6. Makes dependency injection possible
// 7. Improves code maintainability and testability

export {
  Database,
  MySQLDatabase,
  MongoDatabase,
  PostgreSQLDatabase,
  UserService,
  EmailService,
  SMTPEmailService,
  SendGridEmailService,
  AWSEmailService,
  MockEmailService,
  NotificationService,
  PaymentProcessor,
  StripePaymentProcessor,
  PayPalPaymentProcessor,
  MockPaymentProcessor,
  OrderService,
  DIContainer,
  demonstrateDIP,
};
