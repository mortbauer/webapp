import json
import iso8601
from aiohttp import web
# Taken from http://taketwoprogramming.blogspot.com/2009/06/subclassing-jsonencoder-and-jsondecoder.html

def dump_datetime(datetime):
    return datetime.isoformat()

def load_datetime(datetime):
    return iso8601.parse_date(datetime)

def jsonify(resp,data):
    body = json.dumps(data).encode('utf-8')
    return resp(body=body,content_type='application/json')

def json_response(data):
    return web.Response(body=json.dumps(data).encode('utf-8'),content_type='application/json')

def error_response(errors):
    return {'status':'error','errors':errors}

def success_response(data):
    return {'status':'success','result':data}

