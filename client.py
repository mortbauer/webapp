import requests

BASE_URL = 'http://localhost:5000/api'
r = requests.post(BASE_URL+'/get_token',json={'email':'mortbauer@gmail.com','password':'leopold'})
if r.status_code == 200:
    t =r.json()['token']
    headers = {'Authorization':t}
    r = requests.get(BASE_URL+'/user',headers=headers)
    r = requests.get(BASE_URL+'/transactions',headers=headers)

