import datetime

from sqlalchemy import (
    Column,
    Integer,
    Unicode,
    UnicodeText,
    DateTime,
    )

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class DetailInfo(Base):
    __tablename__ = 'cal_details'
    id = Column(Integer, primary_key=True)
    title = Column(Unicode(128), nullable=False)
    content = Column(UnicodeText, default='')
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

