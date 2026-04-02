# Room API Documentation

## Overview
The Room API provides endpoints for managing game rooms in the Monopoly game, including creating, joining, leaving, and managing room settings.

## Base URL
```
/api/rooms
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Data Models

### GameRoom Interface
```typescript
interface GameRoom {
  _id: string;
  name: string;
  creatorId: string; // User ID
  isPrivate: boolean;
  password?: string; // Only for private rooms (hashed)
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  players: string[]; // Array of user IDs
  settings: {
    turnTimeLimit: number;
    autoRoll: boolean;
    startingMoney: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### User Info (Populated)
```typescript
interface UserInfo {
  _id: string;
  username: string;
  displayName: string;
  emoji: string;
}
```

---

## API Endpoints

### 1. Create Room
**POST** `/rooms`

Creates a new game room with the specified settings.

#### Request Body
```typescript
interface CreateRoomDto {
  name: string;
  isPrivate?: boolean; // Default: false
  password?: string; // Required only if isPrivate is true
  maxPlayers?: number; // Default: 4, Min: 2, Max: 8
  turnTimeLimit?: number; // Default: 30, Min: 10, Max: 120 (seconds)
  autoRoll?: boolean; // Default: false
  startingMoney?: number; // Default: 1500, Min: 500, Max: 5000
}
```

#### Example Request
```json
{
  "name": "Fun Monopoly Game",
  "isPrivate": true,
  "password": "secret123",
  "maxPlayers": 6,
  "turnTimeLimit": 45,
  "autoRoll": true,
  "startingMoney": 2000
}
```

#### Response (201 Created)
```typescript
interface RoomResponse {
  _id: string;
  name: string;
  creatorId: string;
  isPrivate: boolean;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  players: string[];
  settings: {
    turnTimeLimit: number;
    autoRoll: boolean;
    startingMoney: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Example Response
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "Fun Monopoly Game",
  "creatorId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "isPrivate": true,
  "maxPlayers": 6,
  "currentPlayers": 1,
  "status": "waiting",
  "players": ["64f8a1b2c3d4e5f6a7b8c9d1"],
  "settings": {
    "turnTimeLimit": 45,
    "autoRoll": true,
    "startingMoney": 2000
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. List Rooms
**GET** `/rooms`

Retrieves a list of available rooms.

#### Query Parameters
- `status` (optional): Filter by room status
  - Values: `waiting`, `playing`, `finished`
  - Default: `waiting`

#### Example Request
```
GET /rooms?status=waiting
```

#### Response (200 OK)
```typescript
interface RoomListResponse {
  rooms: RoomResponse[];
}
```

#### Example Response
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Fun Monopoly Game",
    "creatorId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "isPrivate": true,
    "maxPlayers": 6,
    "currentPlayers": 2,
    "status": "waiting",
    "players": ["64f8a1b2c3d4e5f6a7b8c9d1", "64f8a1b2c3d4e5f6a7b8c9d2"],
    "settings": {
      "turnTimeLimit": 45,
      "autoRoll": true,
      "startingMoney": 2000
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

---

### 3. Get My Rooms
**GET** `/rooms/my-rooms`

Retrieves rooms created by or joined by the current user.

#### Response (200 OK)
Same format as List Rooms endpoint.

---

### 4. Get Room Details
**GET** `/rooms/:id`

Retrieves detailed information about a specific room.

#### Path Parameters
- `id`: Room ID

#### Response (200 OK)
```typescript
interface RoomDetailsResponse extends RoomResponse {
  creatorInfo: UserInfo;
  playerInfo: UserInfo[];
}
```

#### Example Response
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "Fun Monopoly Game",
  "creatorId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "isPrivate": true,
  "maxPlayers": 6,
  "currentPlayers": 2,
  "status": "waiting",
  "players": ["64f8a1b2c3d4e5f6a7b8c9d1", "64f8a1b2c3d4e5f6a7b8c9d2"],
  "settings": {
    "turnTimeLimit": 45,
    "autoRoll": true,
    "startingMoney": 2000
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

---

### 5. Update Room
**PATCH** `/rooms/:id`

Updates room settings. Only the room creator can update a room.

#### Path Parameters
- `id`: Room ID

#### Request Body
```typescript
interface UpdateRoomDto {
  name?: string;
  isPrivate?: boolean;
  password?: string;
  maxPlayers?: number; // Min: 2, Max: 8
  turnTimeLimit?: number; // Min: 10, Max: 120
  autoRoll?: boolean;
  startingMoney?: number; // Min: 500, Max: 5000
}
```

#### Example Request
```json
{
  "name": "Updated Room Name",
  "maxPlayers": 8,
  "turnTimeLimit": 60
}
```

#### Response (200 OK)
Same format as Room Details Response.

---

### 6. Delete Room
**DELETE** `/rooms/:id`

Deletes a room. Only the room creator can delete a room.

#### Path Parameters
- `id`: Room ID

#### Response (204 No Content)
No response body.

---

### 7. Join Room
**POST** `/rooms/:id/join`

Adds the current user to a room.

#### Path Parameters
- `id`: Room ID

#### Request Body
```typescript
interface JoinRoomDto {
  password?: string; // Required only for private rooms
}
```

#### Example Request
```json
{
  "password": "secret123"
}
```

#### Response (200 OK)
Same format as Room Details Response.

---

### 8. Leave Room
**POST** `/rooms/:id/leave`

Removes the current user from a room.

#### Path Parameters
- `id`: Room ID

#### Response (204 No Content)
No response body.

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Room is full",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Only the room creator can update the room",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Room not found",
  "error": "Not Found"
}
```

---

## Business Logic

### Room Creation
- Creator is automatically added as the first player
- Password is hashed using bcrypt for private rooms
- Default settings are applied if not specified

### Joining Rooms
- Cannot join if room is full
- Cannot join if room status is not 'waiting'
- Password validation for private rooms
- Users cannot join the same room twice

### Leaving Rooms
- If creator leaves, ownership transfers to the next player
- If last player leaves, room is automatically deleted
- Cannot leave a room you're not in

### Room Updates
- Only room creator can update settings
- Cannot set max players below current player count
- Password is hashed when updated

---

## Rate Limiting
All endpoints are subject to rate limiting to prevent abuse.

## WebSocket Events
Room operations trigger WebSocket events for real-time updates:
- `room:created` - New room created
- `room:updated` - Room settings changed
- `room:deleted` - Room deleted
- `room:player_joined` - Player joined room
- `room:player_left` - Player left room
