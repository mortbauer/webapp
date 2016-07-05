import json

class RedisSession:
    def __init__(self,redis_pool):
        self.pool = redis_pool

    async def set_session_permissions(self,token,roles):
        keys = ['role_permissions::%s'%x for x in roles]
        with await self.pool as redis:
            await redis.sadd('session_tokens',token)
            await redis.sunionstore('session_permissions::%s'%token,*keys)

    async def set_role_permissions(self,role,permissions):
        key = 'role_permissions::%s'%role
        with await self.pool as redis:
            await redis.delete(key)
            await redis.sadd(key,*permissions)


