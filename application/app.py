from flask import request, render_template, jsonify, url_for, redirect, g
from sqlalchemy.exc import IntegrityError
from flask_socketio import emit

from .utils.auth import generate_token, requires_auth, verify_token
from .import models
from .import app, db, sockets

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route('/api/current_user')
@requires_auth
def get_current_user():
    return jsonify(result=g.current_user)


@app.route("/api/users", methods=["GET"])
@requires_auth
def get_users():
    users = models.User.query.filter().all()
    return jsonify(result=[{'id':x.id,'email':x.email} for x in users])


@app.route("/api/usermeta/<int:user_id>", methods=["GET"])
@requires_auth
def get_usermeta(user_id):
    meta = models.User.query.filter_by(id=user_id).first().meta
    return jsonify(result={'username':meta.username,'surname':meta.surname})


@app.route("/api/usermeta/<int:user_id>", methods=["PUT"])
@requires_auth
def set_usermeta(user_id):
    incoming = request.get_json()
    meta = models.User.query.filter_by(id=user_id).first().meta
    meta.username = incoming['username']
    meta.surname = incoming['surname']
    db.session.commit()
    return jsonify({'msg':'updated usermeta %s'%user_id})


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    if incoming and 'email' in incoming and 'password' in incoming:
        user = models.User(
                email=incoming["email"],
                password=incoming["password"]
        )
        db.session.add(user)
        try:
            db.session.commit()
        except IntegrityError:
            return jsonify(message="User with that email already exists"), 409
        new_user = models.User.query.filter_by(email=incoming["email"]).first()
        return jsonify(id=user.id,token=generate_token(new_user))
    else:
        return jsonify(error=True), 400


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    if incoming and 'email' in incoming and 'password' in incoming:
        user = models.User.get_user_with_email_and_password(
            incoming["email"], incoming["password"])
    else:
        user = None
    if user:
        return jsonify(token=generate_token(user))
    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])
    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403


@app.route("/api/transactions", methods=["GET"])
@requires_auth
def get_transactions():
    serialized = []
    for tr in models.Transaction.query.filter().all():
        serialized.append({
            'id':tr.id,
            'amount':tr.amount,
            'bic_blz':tr.bic_blz,
            'iban_knr':tr.iban_knr,
            'our_iban':tr.our_iban,
            'date':tr.date.isoformat(),
            'comment':tr.comment,
            'transaction_number':tr.transaction_number,
        })
    return jsonify(result=serialized)

@sockets.route('/')
def echo_socket(ws):
    print('connected to {:}'.format(ws))
    while not ws.closed:
        message = ws.receive()
        print('got %s'%message)
