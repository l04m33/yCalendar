import datetime as dt

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


class User(Base):
    __tablename__ = 'cal_users'
    id          = Column(Unicode(64), primary_key=True)
    name        = Column(Unicode(128), nullable=False)
    password    = Column(Unicode(128), nullable=False)

    def check_password(self, password):
        return self.password == password


class DetailInfo(Base):
    __tablename__ = 'cal_details'
    id          = Column(Integer, primary_key=True)
    title       = Column(Unicode(128), nullable=False)
    content     = Column(UnicodeText, default='')
    timestamp   = Column(DateTime, default=dt.datetime.utcnow)
    ts_year     = Column(Integer, nullable=False)
    ts_month    = Column(Integer, nullable=False)
    ts_day      = Column(Integer, nullable=False)
    ts_weekday  = Column(Integer, nullable=False)

