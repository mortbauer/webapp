import sqlalchemy as sa

metadata = sa.MetaData()

user = sa.Table(
    'users',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('email', sa.Unicode(320), nullable=False),
    sa.Column('username',sa.String(64), unique=True, nullable=False),
    sa.Column('password', sa.LargeBinary(60), nullable=False),
    sa.Column('name',sa.String(64)),
    sa.Column('surname',sa.String(64)),
    sa.Column('order_group_id',sa.Integer,sa.ForeignKey('order_groups.id')),
)

group = sa.Table(
    'order_groups',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('name',sa.String(255),unique=True, nullable=False),
)

transaction = sa.Table(
    'transactions',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('version',sa.Integer, nullable=False),
    sa.Column('our_iban',sa.String(255), nullable=False),
    sa.Column('date',sa.Date(), nullable=False),
    sa.Column('bic_blz',sa.String(25)),
    sa.Column('transaction_number',sa.String(25)),
    sa.Column('iban_knr',sa.String(25)),
    sa.Column('amount',sa.Float()),
    sa.Column('comment',sa.String(255)),
    sa.Column('verified',sa.Boolean()),
    sa.Column('order_group_id',sa.Integer,sa.ForeignKey('order_groups.id')),
)

role = sa.Table(
    'roles',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('name', sa.String(60), unique=True),
)

permission = sa.Table(
    'permissions',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('name', sa.String(60), unique=True),
)

user_role = sa.Table(
    'user_roles',
    metadata,
    sa.Column('user_id',sa.Integer,sa.ForeignKey('users.id')),
    sa.Column('role_id',sa.Integer,sa.ForeignKey('roles.id')),
)

role_permisson = sa.Table(
    'role_permissons',
    metadata,
    sa.Column('role_id',sa.Integer,sa.ForeignKey('roles.id')),
    sa.Column('permission_id',sa.Integer,sa.ForeignKey('permissions.id')),
)
