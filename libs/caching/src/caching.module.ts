import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              // luu vao ramm
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            // luu vao redis de tranh mat data khi restart server
            createKeyv('redis://localhost:6379'),
          ],
        };
      },
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
