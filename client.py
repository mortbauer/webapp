import requests

BASE_URL = 'http://localhost:5000/api'
t = requests.post(BASE_URL+'/get_token',json={'email':'mortbaur@gmail.it','password':'leopold'}).json()['token']

headers = {'Authorization':t}
r = requests.get(BASE_URL+'/user',headers=headers)

