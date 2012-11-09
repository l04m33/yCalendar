from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    DetailInfo,
    )

import datetime as dt
import sqlalchemy as sqla


# TODO: add the input date parameter and process it....
@view_config(route_name='daily_list.json', renderer='json')
def daily_list_json(request):
    try:
        info_list = DBSession.query(DetailInfo).filter(
                DetailInfo.timestamp >= dt.datetime(2012, 11, 8, 0, 0, 0),
                DetailInfo.timestamp < dt.datetime(2012, 11, 9, 0, 0, 0)).order_by(sqla.desc(DetailInfo.timestamp)).all()
    except DBAPIError:
        return Response('Datebase error.', content_type='text/plain', status_int=500)
    return [detail_info_to_dict(d) for d in info_list]


def detail_info_to_dict(detail_info):
    return {'id':       detail_info.id,
            'title':    detail_info.title,
            'timestamp':int(detail_info.timestamp.strftime('%s'))}

