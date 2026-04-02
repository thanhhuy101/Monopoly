export interface IUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  emoji: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  coins: number;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements IUser {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public displayName: string,
    public emoji: string,
    public avatarUrl: string | undefined,
    public level: number,
    public experience: number,
    public coins: number,
    public isOnline: boolean,
    public lastSeen: Date,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(userData: Partial<IUser>): UserEntity {
    return new UserEntity(
      userData.id || '',
      userData.username || '',
      userData.email || '',
      userData.displayName || '',
      userData.emoji || '😊',
      userData.avatarUrl,
      userData.level || 1,
      userData.experience || 0,
      userData.coins || 1000,
      userData.isOnline || false,
      userData.lastSeen || new Date(),
      userData.createdAt || new Date(),
      userData.updatedAt || new Date(),
    );
  }

  updateProfile(updates: Partial<Omit<IUser, 'id' | 'createdAt'>>): UserEntity {
    return new UserEntity(
      this.id,
      updates.username ?? this.username,
      updates.email ?? this.email,
      updates.displayName ?? this.displayName,
      updates.emoji ?? this.emoji,
      updates.avatarUrl ?? this.avatarUrl,
      updates.level ?? this.level,
      updates.experience ?? this.experience,
      updates.coins ?? this.coins,
      updates.isOnline ?? this.isOnline,
      updates.lastSeen ?? this.lastSeen,
      this.createdAt,
      new Date(),
    );
  }

  addExperience(amount: number): UserEntity {
    const newExperience = this.experience + amount;
    const newLevel = Math.floor(newExperience / 1000) + 1;
    
    return new UserEntity(
      this.id,
      this.username,
      this.email,
      this.displayName,
      this.emoji,
      this.avatarUrl,
      newLevel,
      newExperience,
      this.coins,
      this.isOnline,
      this.lastSeen,
      this.createdAt,
      new Date(),
    );
  }

  addCoins(amount: number): UserEntity {
    return new UserEntity(
      this.id,
      this.username,
      this.email,
      this.displayName,
      this.emoji,
      this.avatarUrl,
      this.level,
      this.experience,
      this.coins + amount,
      this.isOnline,
      this.lastSeen,
      this.createdAt,
      new Date(),
    );
  }

  setOnlineStatus(isOnline: boolean): UserEntity {
    return new UserEntity(
      this.id,
      this.username,
      this.email,
      this.displayName,
      this.emoji,
      this.avatarUrl,
      this.level,
      this.experience,
      this.coins,
      isOnline,
      new Date(),
      this.createdAt,
      new Date(),
    );
  }
}
