"""empty message

Revision ID: 2c089ff9d401
Revises: eb0dfa8d0fda
Create Date: 2024-05-30 16:30:44.761174

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2c089ff9d401'
down_revision = 'eb0dfa8d0fda'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('movie', schema=None) as batch_op:
        batch_op.add_column(sa.Column('api_id', sa.Integer(), nullable=True))

    with op.batch_alter_table('serie', schema=None) as batch_op:
        batch_op.add_column(sa.Column('api_id', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('serie', schema=None) as batch_op:
        batch_op.drop_column('api_id')

    with op.batch_alter_table('movie', schema=None) as batch_op:
        batch_op.drop_column('api_id')

    # ### end Alembic commands ###
