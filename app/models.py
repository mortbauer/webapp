import sqlalchemy as sa

metadata = sa.MetaData()

user = sa.Table(
    'user',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('email', sa.Unicode(255), unique=True, nullable=False),
    sa.Column('username',sa.String(255), unique=True),
    sa.Column('password', sa.Unicode(255), nullable=False),
    sa.Column('name',sa.String(255)),
    sa.Column('surname',sa.String(255)),
    sa.Column('group_id',None,sa.ForeignKey('group.id')),
)

group = sa.Table(
    'group',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('name',sa.String(255),unique=True, nullable=False),
)

transaction = sa.Table(
    'transaction',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('our_iban',sa.String(255), nullable=False),
    sa.Column('date',sa.Date(), nullable=False),
    sa.Column('bic_blz',sa.String(25)),
    sa.Column('transaction_number',sa.String(25)),
    sa.Column('iban_knr',sa.String(25)),
    sa.Column('amount',sa.Float()),
    sa.Column('comment',sa.String(255)),
    sa.Column('verified',sa.Boolean()),
    sa.Column('group_id',None,sa.ForeignKey('group.id')),
)
