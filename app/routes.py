from aiohttp.web_urldispatcher import UrlDispatcher

from . import views_sync as views

router = UrlDispatcher()

users_resource = router.add_resource('/api/users', name='users')
users_resource.add_route('GET',views.users_get)
users_resource.add_route('POST',views.users_post)

user_resource = router.add_resource('/api/user/{id}', name='user')
user_resource.add_route('GET',views.user_get)

transactions_resource = router.add_resource('/api/transactions', name='transactions')
transactions_resource.add_route('GET',views.transactions_get)

router.add_route('POST','/api/get_token',views.get_token)
router.add_route('POST','/api/is_token_valid',views.is_token_valid)
router.add_route('GET','/api/ws',views.websocket_handler)



