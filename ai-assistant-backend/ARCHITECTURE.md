# AI Assistant Backend Architecture

## System Architecture Diagram

```mermaid
graph TB
    %% External Systems
    subgraph "External Systems"
        GEMINI[Gemini AI API]
        SMTP[SMTP Server]
        MONGODB[(MongoDB)]
    end

    %% Main Application
    subgraph "Express.js Server"
        INDEX[index.js<br/>Main Server]
        
        %% Routes
        subgraph "API Routes"
            USER_ROUTES[user.js<br/>Auth Routes]
            TICKET_ROUTES[ticket.js<br/>Ticket Routes]
            INNGEST_ROUTES[inngest.js<br/>Background Tasks]
        end
        
        %% Controllers
        subgraph "Controllers"
            USER_CTRL[user-controller.js<br/>Auth Logic]
            TICKET_CTRL[ticket-controller.js<br/>Ticket Logic]
        end
        
        %% Middleware
        subgraph "Middleware"
            AUTH[auth.js<br/>JWT Authentication]
        end
        
        %% Models
        subgraph "Database Models"
            USER_MODEL[user.js<br/>User Schema]
            TICKET_MODEL[ticket.js<br/>Ticket Schema]
        end
        
        %% Utils
        subgraph "Utilities"
            AI_UTIL[ai.js<br/>Gemini Integration]
            MAILER_UTIL[mailer.js<br/>Email Service]
        end
        
        %% Inngest Functions
        subgraph "Background Processing"
            INNGEST_CLIENT[client.js<br/>Inngest Client]
            ON_SIGNUP[on-signup.js<br/>User Registration]
            ON_TICKET[on-ticket-create.js<br/>Ticket Processing]
        end
    end

    %% Data Flow Connections
    INDEX --> USER_ROUTES
    INDEX --> TICKET_ROUTES
    INDEX --> INNGEST_ROUTES
    
    USER_ROUTES --> AUTH
    TICKET_ROUTES --> AUTH
    
    USER_ROUTES --> USER_CTRL
    TICKET_ROUTES --> TICKET_CTRL
    
    USER_CTRL --> USER_MODEL
    TICKET_CTRL --> TICKET_MODEL
    
    AUTH --> USER_MODEL
    
    ON_SIGNUP --> USER_MODEL
    ON_SIGNUP --> MAILER_UTIL
    
    ON_TICKET --> TICKET_MODEL
    ON_TICKET --> USER_MODEL
    ON_TICKET --> AI_UTIL
    ON_TICKET --> MAILER_UTIL
    
    AI_UTIL --> GEMINI
    MAILER_UTIL --> SMTP
    
    USER_MODEL --> MONGODB
    TICKET_MODEL --> MONGODB
    
    INNGEST_CLIENT --> ON_SIGNUP
    INNGEST_CLIENT --> ON_TICKET

    %% Styling
    classDef external fill:#e1f5fe
    classDef server fill:#f3e5f5
    classDef routes fill:#e8f5e8
    classDef controllers fill:#fff3e0
    classDef middleware fill:#fce4ec
    classDef models fill:#f1f8e9
    classDef utils fill:#e0f2f1
    classDef inngest fill:#fafafa

    class GEMINI,SMTP,MONGODB external
    class INDEX server
    class USER_ROUTES,TICKET_ROUTES,INNGEST_ROUTES routes
    class USER_CTRL,TICKET_CTRL controllers
    class AUTH middleware
    class USER_MODEL,TICKET_MODEL models
    class AI_UTIL,MAILER_UTIL utils
    class INNGEST_CLIENT,ON_SIGNUP,ON_TICKET inngest
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Express as Express Server
    participant Auth as Auth Middleware
    participant Controller as Controllers
    participant Model as Database Models
    participant Inngest as Inngest Functions
    participant AI as Gemini AI
    participant Email as Email Service
    participant MongoDB as MongoDB

    %% User Registration Flow
    Client->>Express: POST /api/auth/signup
    Express->>Controller: signup()
    Controller->>Model: User.create()
    Model->>MongoDB: Save user
    Controller->>Inngest: Send user/signup event
    Inngest->>Email: Send welcome email
    Controller->>Client: Return JWT token

    %% User Login Flow
    Client->>Express: POST /api/auth/login
    Express->>Controller: login()
    Controller->>Model: User.findOne()
    Model->>MongoDB: Query user
    Controller->>Client: Return JWT token

    %% Ticket Creation Flow
    Client->>Express: POST /api/tickets
    Express->>Auth: Verify JWT token
    Auth->>Express: User authenticated
    Express->>Controller: createTicket()
    Controller->>Model: Ticket.create()
    Model->>MongoDB: Save ticket
    Controller->>Inngest: Send ticket/created event
    Inngest->>Model: Update ticket status
    Inngest->>AI: Analyze ticket with Gemini
    AI->>Inngest: Return analysis
    Inngest->>Model: Update priority & notes
    Inngest->>Model: Find suitable moderator
    Inngest->>Email: Send assignment notification
    Controller->>Client: Return success response

    %% Ticket Retrieval Flow
    Client->>Express: GET /api/tickets
    Express->>Auth: Verify JWT token
    Auth->>Express: User authenticated
    Express->>Controller: getTickets()
    Controller->>Model: Ticket.find()
    Model->>MongoDB: Query tickets
    Controller->>Client: Return tickets
```

## Database Schema Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String email UK
        String password
        String role
        Array skills
        Date createdAt
    }

    TICKET {
        ObjectId _id PK
        String title
        String description
        String status
        ObjectId createdBy FK
        ObjectId assignedTo FK
        String priority
        Date deadline
        String helpfulNotes
        Array relatedSkills
        Date createdAt
    }

    USER ||--o{ TICKET : "creates"
    USER ||--o{ TICKET : "assigned to"
```

## Environment Variables Dependencies

```mermaid
graph LR
    subgraph "Environment Variables"
        MONGO_URI[MONGO_URI]
        JWT_SECRET[JWT_SECRET]
        EMAIL_HOST[EMAIL_HOST]
        EMAIL_PORT[EMAIL_PORT]
        EMAIL_USER[EMAIL_USER]
        EMAIL_PASS[EMAIL_PASS]
        GEMINI_API_KEY[GEMINI_API_KEY]
        PORT[PORT]
    end

    subgraph "Files Using Variables"
        INDEX[index.js]
        USER_CTRL[user-controller.js]
        AUTH[auth.js]
        AI_UTIL[ai.js]
        MAILER_UTIL[mailer.js]
    end

    MONGO_URI --> INDEX
    PORT --> INDEX
    JWT_SECRET --> USER_CTRL
    JWT_SECRET --> AUTH
    GEMINI_API_KEY --> AI_UTIL
    EMAIL_HOST --> MAILER_UTIL
    EMAIL_PORT --> MAILER_UTIL
    EMAIL_USER --> MAILER_UTIL
    EMAIL_PASS --> MAILER_UTIL
```

## How to View These Diagrams

### Option 1: GitHub (Recommended)
1. Push this file to your GitHub repository
2. GitHub automatically renders Mermaid diagrams in markdown files
3. View the rendered diagrams directly on GitHub

### Option 2: VS Code Extension
1. Install the "Markdown Preview Mermaid Support" extension
2. Open the `ARCHITECTURE.md` file
3. Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac) to open preview
4. The diagrams will be rendered in the preview

### Option 3: Online Mermaid Editor
1. Go to [Mermaid Live Editor](https://mermaid.live/)
2. Copy the diagram code (between the ```mermaid blocks)
3. Paste it into the editor
4. View the rendered diagram

### Option 4: Local Development
1. Install Mermaid CLI: `npm install -g @mermaid-js/mermaid-cli`
2. Generate PNG: `mmdc -i ARCHITECTURE.md -o architecture.png`
3. Or generate SVG: `mmdc -i ARCHITECTURE.md -o architecture.svg`

## Key Architecture Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (user, moderator, admin)
- Middleware protection for routes

### 🎫 Ticket Management
- CRUD operations for tickets
- AI-powered ticket analysis
- Automatic priority assignment
- Moderator assignment based on skills

### 🤖 AI Integration
- Gemini AI for ticket analysis
- Automatic priority detection
- Skill requirement identification
- Helpful notes generation

### 📧 Background Processing
- Inngest for async task processing
- Email notifications
- Welcome emails on signup
- Ticket assignment notifications

### 🗄️ Database Design
- MongoDB with Mongoose ODM
- User and Ticket schemas
- Proper relationships and indexing
- Role-based data access

This architecture provides a scalable, maintainable backend system with modern practices like background processing, AI integration, and proper separation of concerns. 