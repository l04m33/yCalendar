from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import (
    DBSession,
    Base,
    )

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.add_static_view('static', 'static', cache_max_age=3600)
    #config.add_route('home', '/')
    config.add_route('daily_list.json',             '/json/daily_list/{year:\d+}-{month:\d+}-{day:\d+}')
    config.add_route('vertical_daily_list.json',    '/json/vert_daily_list/{year:\d+}-{month:\d+}-{day:\d+}')
    config.add_route('detail_info.json',            '/json/detail_info/{id:\d+}')
    config.add_route('update_detail_info.json',     '/json/detail_info/{id:\d+}/update')
    config.scan()
    return config.make_wsgi_app()

