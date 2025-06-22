/**
 * Single Responsibility Principle (SRP)
 * 
 * A class should have only one reason to change.
 * Each class should have a single responsibility or purpose.
 */

// ❌ BAD: Violating SRP - UserManager does too many things
class UserManagerBad {
    private users: User[] = [];

    // User management responsibility
    addUser(user: User): void {
        this.users.push(user);
    }

    // Email sending responsibility
    sendWelcomeEmail(user: User): void {
        console.log(`Sending welcome email to ${user.email}`);
        // Email logic here...
    }

    // Data persistence responsibility
    saveToDatabase(user: User): void {
        console.log(`Saving user ${user.name} to database`);
        // Database logic here...
    }

    // Logging responsibility
    logUserActivity(user: User, activity: string): void {
        console.log(`User ${user.name} performed: ${activity}`);
        // Logging logic here...
    }
}

// ✅ GOOD: Following SRP - Each class has a single responsibility
interface User {
    id: string;
    name: string;
    email: string;
}

// Responsible only for user management
class UserManager {
    private users: User[] = [];

    addUser(user: User): void {
        this.users.push(user);
    }

    removeUser(id: string): void {
        this.users = this.users.filter(user => user.id !== id);
    }

    getUser(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    getAllUsers(): User[] {
        return [...this.users];
    }
}

// Responsible only for email operations
class EmailService {
    sendWelcomeEmail(user: User): void {
        console.log(`Sending welcome email to ${user.email}`);
        // Email service logic
        this.sendEmail(user.email, 'Welcome!', this.getWelcomeTemplate(user.name));
    }

    sendPasswordResetEmail(user: User): void {
        console.log(`Sending password reset email to ${user.email}`);
        // Password reset email logic
    }

    private sendEmail(to: string, subject: string, body: string): void {
        // Actual email sending implementation
        console.log(`Email sent to ${to}: ${subject}`);
    }

    private getWelcomeTemplate(name: string): string {
        return `Hello ${name}, welcome to our platform!`;
    }
}

// Responsible only for data persistence
class UserRepository {
    private database: any; // Imagine this is a real database connection

    async saveUser(user: User): Promise<void> {
        console.log(`Saving user ${user.name} to database`);
        // Database save logic
        try {
            // await this.database.users.insert(user);
            console.log('User saved successfully');
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    async getUserById(id: string): Promise<User | null> {
        console.log(`Fetching user with id: ${id}`);
        // Database fetch logic
        return null; // Placeholder
    }

    async updateUser(user: User): Promise<void> {
        console.log(`Updating user ${user.name}`);
        // Database update logic
    }

    async deleteUser(id: string): Promise<void> {
        console.log(`Deleting user with id: ${id}`);
        // Database delete logic
    }
}

// Responsible only for logging activities
class ActivityLogger {
    private logs: string[] = [];

    logUserActivity(user: User, activity: string): void {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] User ${user.name} (${user.id}) performed: ${activity}`;
        this.logs.push(logEntry);
        console.log(logEntry);
    }

    logSystemActivity(activity: string): void {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] System: ${activity}`;
        this.logs.push(logEntry);
        console.log(logEntry);
    }

    getLogs(): string[] {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

// Orchestrator class that coordinates all services
class UserService {
    constructor(
        private userManager: UserManager,
        private emailService: EmailService,
        private userRepository: UserRepository,
        private activityLogger: ActivityLogger
    ) {}

    async registerUser(userData: Omit<User, 'id'>): Promise<User> {
        // Create user with generated ID
        const user: User = {
            id: this.generateUserId(),
            ...userData
        };

        // Each service handles its own responsibility
        this.userManager.addUser(user);
        await this.userRepository.saveUser(user);
        this.emailService.sendWelcomeEmail(user);
        this.activityLogger.logUserActivity(user, 'User registered');

        return user;
    }

    private generateUserId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Usage example
function demonstrateSRP() {
    const userManager = new UserManager();
    const emailService = new EmailService();
    const userRepository = new UserRepository();
    const activityLogger = new ActivityLogger();

    const userService = new UserService(
        userManager,
        emailService,
        userRepository,
        activityLogger
    );

    // Register a new user
    userService.registerUser({
        name: 'John Doe',
        email: 'john@example.com'
    });
}

// Benefits of following SRP:
// 1. Each class is easier to understand and maintain
// 2. Changes to email logic don't affect user management
// 3. Each class can be tested independently
// 4. Code is more reusable (EmailService can be used elsewhere)
// 5. Easier to add new features without modifying existing classes

export {
    UserManager,
    EmailService,
    UserRepository,
    ActivityLogger,
    UserService,
    demonstrateSRP
}; 