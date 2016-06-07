from marshmallow import Schema, fields

class UserSchema(Schema):
    email = fields.Email()
    username = fields.Str()
    name = fields.Str()
    surname = fields.Str()
    group_id = fields.Int()

class GroupSchema(Schema):
    name = fields.Str()
    users = fields.Nested(UserSchema,many=True)
