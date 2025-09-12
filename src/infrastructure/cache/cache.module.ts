import { Module } from '@nestjs/common';

import { NodeCacheAdapter } from './node_cache.adapter';

@Module({
    providers: [NodeCacheAdapter],
    exports: [NodeCacheAdapter],
})
export class CacheModule {}
