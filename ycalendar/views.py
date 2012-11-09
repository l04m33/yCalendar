from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    DetailInfo,
    )

import datetime as dt
import sqlalchemy as sqla


@view_config(route_name='daily_list.json', renderer='json')
def daily_list(request):
    year = int(request.matchdict.get('year', -1))
    month = int(request.matchdict.get('month', -1))
    day = int(request.matchdict.get('day', -1))
    this_day = dt.datetime(year, month, day)
    next_day = this_day + dt.timedelta(1, 0, 0)
    info_list = DBSession.query(DetailInfo).filter(
            DetailInfo.timestamp >= this_day, 
            DetailInfo.timestamp < next_day).order_by(
                    sqla.desc(DetailInfo.timestamp)).all()
    return {'info_list': [detail_info_to_brief_dict(d) for d in info_list]}


@view_config(route_name='detail_info.json', renderer='json')
def detail_info(request):
    info_id = int(request.matchdict.get('id', -1))
    info = DBSession.query(DetailInfo).filter(DetailInfo.id == info_id).first()
    if info is None:
        return HTTPNotFound()
    return {'info': detail_info_to_full_dict(info)}


def detail_info_to_brief_dict(detail_info):
    return {'id':       detail_info.id,
            'title':    detail_info.title,
            'timestamp':int(detail_info.timestamp.strftime('%s'))}

def detail_info_to_full_dict(detail_info):
    return {'id':       detail_info.id,
            'title':    detail_info.title,
            'content':  detail_info.content,
            'timestamp':int(detail_info.timestamp.strftime('%s'))}

