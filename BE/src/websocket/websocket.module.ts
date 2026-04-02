import { Module, forwardRef } from '@nestjs/common';
import { UserStatusGateway } from './user-status.gateway';
import { RoomEventsGateway } from './room-events.gateway';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => UsersModule), 
    forwardRef(() => RoomsModule),
    AuthModule,
  ],
  providers: [UserStatusGateway, RoomEventsGateway],
  exports: [UserStatusGateway, RoomEventsGateway],
})
export class WebsocketModule {}
