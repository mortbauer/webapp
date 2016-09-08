#!/usr/bin/python
#
# Flask server, woo!
#

from flask import Flask, request, redirect, url_for, send_from_directory

# Setup Flask app.
app = Flask(__name__)
app.debug = False


# Routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def root(path):
    return send_from_directory('static','index.html')

@app.route('/dist/<path:path>')
def send_dist(path):
    return send_from_directory('static/dist', path)

if __name__ == '__main__':
  app.run(port=3000)
