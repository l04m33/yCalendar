from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound, HTTPForbidden
import pyramid.security as sec

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    DetailInfo,
    User
    )

import datetime as dt
import sqlalchemy as sqla


@view_config(route_name='calendar.page', renderer='calendar.mako')
def calendar_page(request):
    user_name = sec.authenticated_userid(request)
    if user_name is None:
        raise HTTPForbidden()

    return {'user_name': user_name}


@view_config(route_name='login.page', renderer='login.mako')
def login_page(request):
    user_name = sec.authenticated_userid(request)
    if user_name is not None:
        return HTTPFound(location=request.route_url('calendar.page'))

    if 'user_name' in request.POST:
        user_name = request.POST.get('user_name', '')
        password = request.POST.get('password', '')
        user = DBSession.query(User).filter(User.id == user_name).first()
        if user is None:
            return HTTPForbidden()
        if user.check_password(password):
            headers = sec.remember(request, user.id)
            calendar_page = request.route_url('calendar.page')
            return HTTPFound(location=calendar_page, headers=headers)
        else:
            return HTTPForbidden()

    else:
        return {}


@view_config(route_name='daily_list.json', renderer='json')
def daily_list(request):
    year = int(request.matchdict.get('year', -1))
    month = int(request.matchdict.get('month', -1))
    day = int(request.matchdict.get('day', -1))

    offset = get_req_data(request.GET, 'offset', int, 0)
    limit = get_req_data(request.GET, 'limit', int, 10)

    this_day = dt.datetime(year, month, day)
    next_day = this_day + dt.timedelta(1, 0, 0)

    info_list = DBSession.query(DetailInfo).filter(
            DetailInfo.timestamp >= this_day, 
            DetailInfo.timestamp < next_day).order_by(
                    sqla.desc(DetailInfo.timestamp)).slice(offset, offset + limit)
    return {'info_list': [detail_info_to_brief_dict(d) for d in info_list]}


@view_config(route_name='vertical_daily_list.json', renderer='json')
def vertical_daily_list(request):
    month = int(request.matchdict.get('month', -1))
    day = int(request.matchdict.get('day', -1))

    offset = get_req_data(request.GET, 'offset', int, 0)
    limit = get_req_data(request.GET, 'limit', int, 10)

    info_list = DBSession.query(DetailInfo).filter(
            DetailInfo.ts_month == month,
            DetailInfo.ts_day == day).order_by(
                    sqla.desc(DetailInfo.timestamp)).slice(offset, offset + limit)
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
        new_timestamp = get_req_data(request.POST, 'timestamp', int, 0)
        if info_id == 0 and (new_title is None or len(new_title) == 0):
            return {'bad_fields': [{'title': 'empty'}]}
        else:
            if new_title is not None and len(new_title) > 0:
                info.title = new_title
            if new_content is not None:
                info.content = new_content
            if info_id == 0:
                if new_timestamp == 0:
                    now = dt.datetime.utcnow()
                else:
                    now = dt.datetime.utcfromtimestamp(new_timestamp)
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


def get_req_data(method, key, val_type, default_val):
    try:
        return val_type(method.get(key, default_val))
    except ValueError:
        return default_val

