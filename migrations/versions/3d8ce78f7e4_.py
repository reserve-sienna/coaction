"""empty message

Revision ID: 3d8ce78f7e4
Revises: None
Create Date: 2015-03-07 18:28:19.469762

"""

# revision identifiers, used by Alembic.
revision = '3d8ce78f7e4'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('encrypted_password', sa.String(length=60), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('task',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.Column('status', sa.String(length=255), nullable=True),
    sa.Column('due_date', sa.String(length=40), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('assigned_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['assigned_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('task')
    op.drop_table('user')
    ### end Alembic commands ###
