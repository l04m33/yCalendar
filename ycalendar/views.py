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
        return {}
    return {'info': detail_info_to_full_dict(info)}


@view_config(route_name='update_detail_info.json', renderer='json')
def update_detail_info(request):
    if request.method == 'POST':
        info_id = int(request.matchdict.get('id', 0))
        if info_id == 0:
            info = DetailInfo()
        else:
            info = DBSession.query(DetailInfo).filter(DetailInfo.id == info_id).first()
            if info is None:
                return {}

        new_title = request.POST.get('title')
        new_content = request.POST.get('content')
        if new_title is None or len(new_title) == 0:
            return {'bad_fields': [{'title': 'empty'}]}
        else:
            info.title = new_title
            info.content = new_content
            if info_id == 0:
                now = dt.datetime.utcnow()
                info.timestamp = now
                info.ts_year = now.year
                info.ts_month = now.month
                info.ts_day = now.day
                iso_weekday = now.isoweekday()      # isoweekday: Mon. 1 -- 7 Sun.
                if iso_weekday == 7:
                    info.ts_weekday = 0             # weekday: Sun. 0 -- 6 Sat.
                else:
                    info.ts_weekday = iso_weekday
                DBSession.add(info)
            return {'ok': 0}

    else:
        return {}


def detail_info_to_brief_dict(detail_info):
    return {'id':       detail_info.id,
            'title':    detail_info.title,
            'timestamp':int(detail_info.timestamp.strftime('%s'))}


def detail_info_to_full_dict(detail_info):
    return {'id':       detail_info.id,
            'title':    detail_info.title,
            'content':  detail_info.content,
            'timestamp':int(detail_info.timestamp.strftime('%s'))}

