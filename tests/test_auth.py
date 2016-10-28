import pytest
import aioredis

from app.auth import Authorization, Authentication


@pytest.fixture
def config():
    from app.settings import BaseConfig
    return BaseConfig()

async def prepare_redis(config):
    pool = await aioredis.create_pool((config.REDIS_HOST,config.REDIS_PORT))
    with await pool as redis:
        keys = await redis.keys('*')
        if len(keys) > 0:
            await redis.delete(*keys)
    return pool

@pytest.fixture
def auth(config,event_loop):
    redis_pool = event_loop.run_until_complete(prepare_redis(config))
    authenticater = Authentication('mysecretkey',expiration=1000)
    authorizer = Authorization(redis_pool,authenticater,expiration=1000)
    yield authorizer
    redis_pool.close()
    event_loop.run_until_complete(redis_pool.wait_closed())

@pytest.mark.asyncio
async def test_get_user_role_empty(auth):
    roles = await auth.get_user_roles('martin')
    assert roles == set()
    
@pytest.mark.asyncio
async def test_set_get_user_role(auth):
    await auth.set_user_roles('martin',['finance_admin'])
    roles = await auth.get_user_roles('martin')
    assert roles == {b'finance_admin'} 

@pytest.mark.asyncio
async def test_get_role_permissions_empty(auth):
    perms =  await auth.get_role_permissions('finance_admin')
    assert perms == set()

@pytest.mark.asyncio
async def test_set_get_role_permissions(auth):
    await auth.set_role_permissions('finance_admin',['Delete Transaction'])
    perms = await auth.get_role_permissions('finance_admin')
    assert perms == {b'Delete Transaction'} 

@pytest.mark.asyncio
async def test_add_user_to_session(auth):
    user = {'id':1,'email':'mytest@mail.com'}
    await auth.set_user_roles(1,['finance_admin','foodsharing_admin'])
    await auth.set_role_permissions('finance_admin',['delete_transactions'])
    await auth.set_role_permissions('foodsharing_admin',['add_articles'])
    token =  await auth.add_user_to_session(user)
    perms = await auth.get_session_permissions(user['id'],token)
    assert perms == {b'delete_transactions',b'add_articles'}

