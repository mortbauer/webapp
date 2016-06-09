import sqlalchemy as sa

metadata = sa.MetaData()

user_table = sa.Table(
    'user',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('email', sa.Unicode(255), unique=True, nullable=False),
    sa.Column('password', sa.Unicode(255), nullable=False),
    sa.Column('name',sa.String(255)),
    sa.Column('surname',sa.String(255)),
    sa.Column('group_id',None,sa.ForeignKey('group.id')),
)
