# Backend API Requirements - Monopoly Game

## Tech Stack
- **Framework**: NestJS
- **Database**: MongoDB
- **Authentication**: JWT + Passport
- **Real-time**: Socket.IO
- **API Documentation**: Swagger

## MongoDB Database Schema

### Users Collection
```typescript
interface User {
  _id: ObjectId;
  username: string;
  email: string;
  displayName: string;
  emoji: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  coins: number;
  password: string; // Hashed password
  createdAt: Date;
  updatedAt: Date;
  isOnline: boolean;
  lastSeen: Date;
}
```

### Game Rooms Collection
```typescript
interface GameRoom {
  _id: ObjectId;
  name: string;
  creatorId: ObjectId; // User ID
  isPrivate: boolean;
  password?: string; // Hashed password
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  players: ObjectId[]; // Array of user IDs
  settings: {
    turnTimeLimit: number;
    autoRoll: boolean;
    startingMoney: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Shop Items Collection
```typescript
interface ShopItem {
  _id: ObjectId;
  name: string;
  type: 'dice' | 'token' | 'bundle';
  price: number;
  imageUrl: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}
```

### User Purchases Collection
```typescript
interface UserPurchase {
  _id: ObjectId;
  userId: ObjectId; // User ID
  itemId: ObjectId; // Shop item ID
  purchasedAt: Date;
}
```

### Leaderboard Collection
```typescript
interface LeaderboardEntry {
  _id: ObjectId; // Same as user ID
  userId: ObjectId;
  username: string;
  displayName: string;
  avatarUrl?: string;
  totalWins: number;
  totalGames: number;
  totalWealth: number;
  winRate: number;
  rankPosition: number;
  updatedAt: Date;
}
```

### Game Sessions Collection (for active games)
```typescript
interface GameSession {
  _id: ObjectId;
  roomId: ObjectId;
  gameState: {
    id: string;
    players: [
      {
        id: number;
        uid: ObjectId; // User ID
        username: string;
        emoji: string;
        money: number;
        position: number;
        properties: string[];
        jailStatus: { inJail: boolean; turns: number };
        bankrupt: boolean;
        isCurrentTurn: boolean;
      }
    ];
    currentPlayer: number;
    phase: 'waiting' | 'playing' | 'finished';
    dice: [number, number];
    board: {
      properties: Record<string, any>;
      houses: Record<string, number>;
      mortgages: Record<string, boolean>;
    };
    log: string[];
    createdAt: Date;
    lastUpdated: Date;
  };
  players: {
    userId: ObjectId;
    status: 'online' | 'offline' | 'disconnected';
    lastSeen: Date;
  }[];
}
```

### Game History Collection
```typescript
interface GameHistory {
  _id: ObjectId;
  roomId: ObjectId;
  sessionId: string;
  players: [
    {
      uid: ObjectId;
      finalPosition: number;
      finalMoney: number;
      propertiesOwned: string[];
      isWinner: boolean;
    }
  ];
  gameData: {
    duration: number;
    totalTurns: number;
    finalBoardState: Record<string, any>;
  };
  playedAt: Date;
}
```

## API Endpoints

## MongoDB Services Integration

### Authentication Service
```typescript
// JWT + Passport Local Strategy
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto) {
    // Hash password
    // Create user in MongoDB
    // Generate JWT token
  }

  async login(credentials: LoginDto) {
    // Validate credentials
    // Generate JWT token
  }

  async verifyToken(token: string) {
    // Verify JWT token
    // Return user data
  }
}
```

### MongoDB Service
```typescript
@Injectable()
export class MongoService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  // Generic CRUD operations
  async create<T>(model: Model<T>, data: any): Promise<T> {}
  async findById<T>(model: Model<T>, id: string): Promise<T | null> {}
  async findOne<T>(model: Model<T>, filter: any): Promise<T | null> {}
  async find<T>(model: Model<T>, filter: any): Promise<T[]> {}
  async updateById<T>(model: Model<T>, id: string, data: any): Promise<T | null> {}
  async deleteById<T>(model: Model<T>, id: string): Promise<boolean> {}
}
```

### Game State Service
```typescript
@Injectable()
export class GameStateService {
  constructor(
    @InjectModel('GameSession') private gameSessionModel: Model<GameSession>,
    private socketGateway: SocketGateway,
  ) {}

  async getGameState(roomId: string) {
    // Get game state from MongoDB
  }

  async updateGameState(roomId: string, gameState: any) {
    // Update game state in MongoDB
    // Emit Socket.IO event to all players
  }

  async updatePlayerStatus(roomId: string, userId: string, status: string) {
    // Update player status in MongoDB
    // Emit Socket.IO event
  }
}
```

## API Endpoints

### Authentication Module (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with JWT
- `POST /auth/logout` - Logout and revoke tokens
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/verify-token` - Verify JWT token
- `POST /auth/forgot-password` - Password reset
- `POST /auth/update-profile` - Update user profile

### Users Module (`/users`)
- `GET /users/profile` - Get current user profile from MongoDB
- `PUT /users/profile` - Update user profile in MongoDB
- `GET /users/:id` - Get public user info
- `GET /users/:id/stats` - Get user statistics
- `POST /users/online-status` - Update online status

### Game Rooms Module (`/rooms`)
- `GET /rooms` - List available rooms from MongoDB
- `POST /rooms` - Create new room in MongoDB
- `GET /rooms/:id` - Get room details from MongoDB
- `PUT /rooms/:id` - Update room settings in MongoDB
- `DELETE /rooms/:id` - Delete room from MongoDB
- `POST /rooms/:id/join` - Join room (update MongoDB + Socket.IO)
- `POST /rooms/:id/leave` - Leave room (update MongoDB + Socket.IO)

### Game Module (`/game`)
- `GET /game/:roomId/state` - Get current game state from MongoDB
- `POST /game/:roomId/start` - Start game (create game session)
- `POST /game/:roomId/roll` - Roll dice (update MongoDB + Socket.IO)
- `POST /game/:roomId/buy` - Buy property (update MongoDB + Socket.IO)
- `POST /game/:roomId/build` - Build house/hotel (update MongoDB + Socket.IO)
- `POST /game/:roomId/trade` - Trade with other players (update MongoDB + Socket.IO)
- `POST /game/:roomId/mortgage` - Mortgage property (update MongoDB + Socket.IO)
- `POST /game/:roomId/end-turn` - End turn (update MongoDB + Socket.IO)
- `POST /game/:roomId/finish` - Finish game (move to history collection)

### Shop Module (`/shop`)
- `GET /shop/items` - List shop items from MongoDB
- `POST /shop/purchase` - Purchase item (update MongoDB)
- `GET /shop/user-items` - Get user's purchased items from MongoDB
- `POST /shop/use-item` - Use purchased item

### Leaderboard Module (`/leaderboard`)
- `GET /leaderboard` - Get top players from MongoDB
- `GET /leaderboard/rank/:id` - Get user's rank from MongoDB
- `POST /leaderboard/update` - Update leaderboard after game

## Real-time Events

### Socket.IO Events
- **Game State Changes**: `game:state-update` - Real-time game state updates
- **Player Status**: `player:status-change` - Player online/offline status
- **Room Updates**: `room:update` - Room status changes
- **Game Actions**: `game:action` - Dice rolls, property purchases, etc.
- **Chat Messages**: `chat:message` - In-game chat

### Socket.IO Events List
- `room:join` - Player joins room
- `room:leave` - Player leaves room
- `game:state-change` - Game state updates
- `player:status` - Player online/offline status
- `game:started` - Game started
- `game:finished` - Game finished
- `turn:changed` - Turn changed to next player
- `dice:rolled` - Dice rolled
- `property:purchased` - Property purchased
- `player:bankrupt` - Player went bankrupt

## Core Features to Implement

### 1. JWT Authentication System
- Passport Local Strategy for email/password
- JWT token generation and validation
- User profile management in MongoDB
- Online status tracking with Socket.IO

### 2. MongoDB Integration
- User data persistence with Mongoose
- Game room management
- Shop items and purchases
- Leaderboard and statistics
- Game history storage

### 3. Socket.IO Real-time Integration
- Real-time game state synchronization
- Player online/offline status
- Live game updates
- Automatic conflict resolution

### 4. Game Room Management
- Create public/private rooms in MongoDB
- Real-time room status updates
- Password protection for private rooms
- Player join/leave handling

### 5. Game Logic Engine
- Complete Monopoly rules implementation
- Turn-based gameplay with Socket.IO sync
- Dice rolling mechanics
- Property buying/selling
- House/hotel building
- Rent calculation
- Chance/Chest cards
- Jail system
- Bankruptcy handling
- Win conditions

### 6. Real-time Multiplayer
- Socket.IO listeners for game state
- Automatic synchronization across clients
- Player presence management
- Reconnection handling
- Conflict resolution

### 7. Shop System
- Virtual currency (coins) in MongoDB
- Item catalog management
- Purchase transactions
- User inventory tracking

### 8. Leaderboard & Stats
- Real-time ranking updates
- Game history tracking
- Statistical analysis
- Achievement system

### 9. Profile System
- JWT authentication integration
- MongoDB user data
- Statistics display
- Achievement badges

## Game State Management

### MongoDB Game State Structure
```typescript
interface GameState {
  id: string; // Room ID
  players: Player[];
  currentPlayer: number;
  phase: 'waiting' | 'playing' | 'finished';
  dice: [number, number] | null;
  board: BoardState;
  log: GameLog[];
  settings: GameSettings;
  createdAt: Date;
  lastUpdated: Date;
}

interface Player {
  id: number;
  uid: ObjectId; // User ID
  username: string;
  emoji: string;
  money: number;
  position: number;
  properties: string[];
  jailStatus: JailStatus;
  bankrupt: boolean;
  isCurrentTurn: boolean;
  lastAction: string;
}

interface BoardState {
  properties: Record<string, PropertyState>;
  houses: Record<string, number>;
  mortgages: Record<string, boolean>;
}
```

## Security Considerations

### MongoDB Security
```javascript
// MongoDB Indexes for security and performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.gameRooms.createIndex({ creatorId: 1 })
db.gameRooms.createIndex({ status: 1 })
db.leaderboard.createIndex({ rankPosition: 1 })
db.leaderboard.createIndex({ totalWins: -1 })

// MongoDB Aggregation Pipelines for complex queries
```

### NestJS Security
- JWT token validation middleware
- Passport authentication strategies
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Password hashing with bcrypt
- MongoDB connection security
- Environment variable protection

## Performance Optimizations

### MongoDB Optimizations
- Compound indexes for complex queries
- Aggregation pipelines for data processing
- Connection pooling with Mongoose
- Bulk operations for multiple updates
- Caching frequently accessed data
- Database sharding for scalability

### NestJS Optimizations
- Efficient MongoDB service initialization
- Connection reuse and caching
- Lazy loading of services
- Memory management for large game states
- Redis caching for session management

### Real-time Features
- Optimized Socket.IO listeners
- Selective data subscriptions
- Efficient state synchronization
- Minimal data transfer
- Room-based broadcasting

## Testing Strategy

### Unit Tests
- MongoDB service layer testing
- Game logic validation
- Authentication flows
- Mongoose model operations

### Integration Tests
- MongoDB database integration
- Socket.IO event handling
- End-to-end game flows
- API endpoint testing

### MongoDB Testing
- In-memory MongoDB for testing
- Mock data factories
- Database cleanup between tests
- Performance testing with large datasets

## Deployment Considerations

### MongoDB Configuration
```typescript
// mongodb.config.ts
export const mongodbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/monopoly',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

// Environment Variables
MONGODB_URI=mongodb://localhost:27017/monopoly
JWT_SECRET=your-nestjs-jwt-secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
SOCKET_CORS_ORIGIN=http://localhost:3000
```

### Swagger Configuration
```typescript
// swagger.config.ts
export const swaggerConfig = {
  title: 'Monopoly Game API',
  description: 'Backend API for Monopoly multiplayer game',
  version: '1.0.0',
  tag: 'monopoly',
  docPath: 'api',
  modules: ['auth', 'users', 'rooms', 'game', 'shop', 'leaderboard'],
};
```

### MongoDB + NestJS Setup
- MongoDB Atlas or self-hosted MongoDB
- Mongoose ODM integration
- Environment-specific settings
- Error handling and logging
- Connection retry logic
- Database backup strategies

### Swagger Documentation
- Automatic API documentation generation
- Interactive API testing interface
- Authentication integration
- Request/response examples
- Error documentation

This updated document provides a comprehensive roadmap for implementing the backend API using NestJS with MongoDB for the Monopoly game, including Swagger documentation and Socket.IO for real-time features.
