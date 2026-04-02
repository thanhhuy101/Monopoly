# Game Module API Requirements - Backend Enhancement

## Overview
Phân tích module game hiện tại và đề xuất các API cần bổ sung để hỗ trợ hoàn chỉnh flow phá sản, chiến thắng và quản lý game.

## Current Game APIs Status ✅

### Existing APIs (Đã có)
- `POST /:roomId/start` - Bắt đầu game
- `GET /:roomId/state` - Lấy trạng thái game
- `POST /:roomId/roll` - Tung xúc xắc
- `POST /:roomId/buy` - Mua bất động sản
- `POST /:roomId/build` - Xây nhà/khách sạn
- `POST /:roomId/mortgage` - Thế chấp bất động sản
- `POST /:roomId/trade` - Giao dịch giữa người chơi
- `POST /:roomId/end-turn` - Kết thúc lượt
- `POST /:roomId/finish` - Kết thúc game
- `PUT /:roomId/player-status` - Cập nhật trạng thái người chơi
- `GET /:roomId/history` - Lấy lịch sử game

## Missing APIs for Bankruptcy Flow ❌

### 1. Bankruptcy Management APIs
```typescript
// Kiểm tra trạng thái phá sản
POST /:roomId/check-bankruptcy
{
  gameId: string;
  playerId: number;
}
Response: {
  isBankrupt: boolean;
  debtAmount: number;
  canRecover: boolean;
  suggestedActions: string[];
}

// Bắt đầu flow phá sản
POST /:roomId/bankruptcy-flow
{
  gameId: string;
  playerId: number;
  debtAmount: number;
}
Response: {
  flowId: string;
  liquidationOptions: Property[];
  tradeOptions: Player[];
  timeLimit: number;
}

// Thanh lý tài sản
POST /:roomId/liquidate-assets
{
  gameId: string;
  playerId: number;
  assetsToLiquidate: {
    propertyId: string;
    action: 'sell_house' | 'sell_deed' | 'mortgage';
  }[];
}
Response: {
  totalRecovered: number;
  remainingDebt: number;
  success: boolean;
}

// Giao dịch trả nợ
POST /:roomId/debt-trade
{
  gameId: string;
  playerId: number;
  tradePartnerId: number;
  offeredAssets: {
    propertyId: string;
    type: 'property' | 'cash';
  }[];
  requestedAmount: number;
}
Response: {
  tradeId: string;
  status: 'pending' | 'accepted' | 'rejected';
  expiresAt: Date;
}

// Không thể trả nợ - Loại người chơi
POST /:roomId/eliminate-player
{
  gameId: string;
  playerId: number;
  reason: 'bankruptcy' | 'disconnect' | 'quit';
}
Response: {
  eliminated: boolean;
  finalRank: number;
  spectatorMode: boolean;
}
```

### 2. Spectator Mode APIs
```typescript
// Chuyển sang mode spectator
POST /:roomId/spectate
{
  gameId: string;
  playerId: number;
}
Response: {
  spectatorToken: string;
  canInteract: boolean;
  viewOnly: boolean;
}

// Rời phòng (cho spectator)
POST /:roomId/leave-room
{
  gameId: string;
  playerId: number;
  spectatorToken: string;
}
Response: {
  left: boolean;
  redirectUrl?: string;
}

// Lấy danh sách spectator
GET /:roomId/spectators
Response: {
  spectators: {
    playerId: number;
    username: string;
    joinedAt: Date;
    canChat: boolean;
  }[];
  total: number;
}
```

### 3. Game Completion APIs
```typescript
// Tự động kiểm tra và kết thúc game
POST /:roomId/check-game-end
{
  gameId: string;
}
Response: {
  shouldEnd: boolean;
  winner: {
    playerId: number;
    username: string;
    totalAssets: number;
    rank: number;
  };
  finalStandings: PlayerRanking[];
}

// Ghi nhận kết quả game
POST /:roomId/save-results
{
  gameId: string;
  results: {
    winnerId: number;
    finalStandings: {
      playerId: number;
      rank: number;
      finalAssets: number;
      playTime: number;
      eliminatedAt?: Date;
    }[];
    gameStats: {
      totalTurns: number;
      duration: number;
      totalTransactions: number;
    };
  };
}
Response: {
  saved: boolean;
  gameId: string;
  rewardsAssigned: boolean;
}
```

### 4. Transaction History APIs
```typescript
// Lấy lịch sử giao dịch chi tiết
GET /:roomId/transactions
Query: {
  playerId?: number;
  type?: 'buy' | 'sell' | 'trade' | 'mortgage' | 'bankruptcy';
  limit?: number;
  offset?: number;
}
Response: {
  transactions: {
    id: string;
    playerId: number;
    type: string;
    amount: number;
    description: string;
    timestamp: Date;
    relatedPlayers?: number[];
  }[];
  total: number;
  hasMore: boolean;
}

// Lấy lịch sử thanh lý
GET /:roomId/liquidation-history
{
  gameId: string;
  playerId: number;
}
Response: {
  liquidations: {
    propertyId: string;
    propertyName: string;
    action: string;
    recoveredAmount: number;
    timestamp: Date;
  }[];
  totalRecovered: number;
  debtRemaining: number;
}
```

### 5. Enhanced Game State APIs
```typescript
// Lấy trạng thái game chi tiết (cho spectator)
GET /:roomId/detailed-state
Query: {
  includeSpectators?: boolean;
  includeHistory?: boolean;
  includeTransactions?: boolean;
}
Response: {
  gameState: CurrentGameState;
  spectators: SpectatorInfo[];
  recentHistory: GameEvent[];
  marketStatus: PropertyMarketStatus;
}

// Lấy thống kê game real-time
GET /:roomId/stats
Response: {
  players: {
    playerId: number;
    username: string;
    money: number;
    properties: number;
    totalAssets: number;
    rank: number;
    isBankrupt: boolean;
    isSpectator: boolean;
  }[];
  market: {
    totalPropertiesInPlay: number;
    totalMortgaged: number;
    averagePropertyValue: number;
  };
  game: {
    currentTurn: number;
    timeRemaining: number;
    activePlayers: number;
    spectators: number;
  };
}
```

## Database Schema Updates Needed

### GameSessions Collection (New)
```typescript
interface GameSession {
  _id: ObjectId;
  roomId: ObjectId;
  players: ObjectId[];
  status: 'active' | 'finished' | 'abandoned';
  winner?: ObjectId;
  finalStandings: {
    playerId: ObjectId;
    rank: number;
    finalAssets: number;
    eliminatedAt?: Date;
    playTime: number;
  };
  gameStats: {
    totalTurns: number;
    duration: number;
    totalTransactions: number;
    bankruptcies: number;
  };
  createdAt: Date;
  finishedAt?: Date;
}
```

### BankruptcyRecords Collection (New)
```typescript
interface BankruptcyRecord {
  _id: ObjectId;
  gameId: ObjectId;
  playerId: ObjectId;
  triggeredAt: Date;
  debtAmount: number;
  assetsAtTime: {
    properties: ObjectId[];
    cash: number;
    totalValue: number;
  };
  resolution: {
    type: 'liquidated' | 'traded' | 'eliminated';
    recoveredAmount?: number;
    eliminatedAt?: Date;
    finalRank?: number;
  };
  liquidationDetails?: {
    soldProperties: ObjectId[];
    mortgagedProperties: ObjectId[];
    totalRecovered: number;
  };
}
```

### TransactionHistory Collection (Enhanced)
```typescript
interface TransactionHistory {
  _id: ObjectId;
  gameId: ObjectId;
  playerId: ObjectId;
  type: 'buy' | 'sell' | 'trade' | 'mortgage' | 'bankruptcy' | 'liquidation';
  amount: number;
  description: string;
  relatedPlayers?: ObjectId[];
  relatedProperties?: ObjectId[];
  metadata?: {
    tradeId?: string;
    bankruptcyId?: string;
    liquidationId?: string;
  };
  timestamp: Date;
}
```

### SpectatorSessions Collection (New)
```typescript
interface SpectatorSession {
  _id: ObjectId;
  gameId: ObjectId;
  playerId: ObjectId;
  token: string;
  joinedAt: Date;
  lastActive: Date;
  permissions: {
    canChat: boolean;
    canViewHistory: boolean;
    canViewTransactions: boolean;
  };
  isActive: boolean;
}
```

## WebSocket Events Enhancement

### New Events Needed
```typescript
// Bankruptcy events
'bankruptcy:triggered' - Khi người chơi vỡ nợ
'bankruptcy:liquidated' - Khi thanh lý thành công
'bankruptcy:eliminated' - Khi bị loại khỏi game
'bankruptcy:trade-offer' - Khi có đề nghị giao dịch

// Spectator events
'spectator:joined' - Khi có người theo dõi
'spectator:left' - Khi spectator rời đi
'spectator:chat' - Khi spectator chat (nếu được phép)

// Game completion events
'game:ending' - Khi game sắp kết thúc
'game:finished' - Khi game kết thúc hoàn tất
'game:results-saved' - Khi kết quả được lưu

// Real-time stats events
'game:stats-update' - Cập nhật thống kê real-time
'market:status-update' - Cập nhật thị trường bất động sản
```

## Priority Implementation Order

### Phase 1 (High Priority) - Core Bankruptcy Flow
1. `POST /:roomId/check-bankruptcy`
2. `POST /:roomId/eliminate-player`
3. `POST /:roomId/liquidate-assets`
4. Database schemas: BankruptcyRecords

### Phase 2 (Medium Priority) - Enhanced Features
1. `POST /:roomId/spectate`
2. `GET /:roomId/transactions`
3. `POST /:roomId/debt-trade`
4. Database schemas: SpectatorSessions, TransactionHistory

### Phase 3 (Low Priority) - Advanced Features
1. `GET /:roomId/detailed-state`
2. `GET /:roomId/stats`
3. `POST /:roomId/save-results`
4. Database schemas: GameSessions

## Security Considerations

### Authentication & Authorization
- Spectator tokens phải có expiry time
- Validate player permissions cho mỗi action
- Rate limiting cho bankruptcy prevention abuse

### Data Validation
- Validate asset values trước khi liquidate
- Prevent self-trade exploits
- Check for concurrent bankruptcy attempts

### Performance
- Cache game state cho spectator requests
- Optimize transaction history queries
- Implement pagination cho history APIs

## Testing Requirements

### Unit Tests
- Bankruptcy calculation logic
- Asset liquidation values
- Spectator permission checks

### Integration Tests
- Complete bankruptcy flow
- Multi-player interactions
- WebSocket event handling

### Load Tests
- Concurrent spectator connections
- High-frequency transaction processing
- Game state synchronization
