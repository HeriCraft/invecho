import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from './inventory/inventory.module';
import { CallingModule } from './calling/calling.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PersistenceModule,
    InventoryModule,
    CallingModule,
    SuppliersModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
