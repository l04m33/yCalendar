from pyramid.config import Configurator
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
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

    authn_policy = AuthTktAuthenticationPolicy(
            secret='safe hidden security secret 6789',
            cookie_name='auth_tkt',
            #hashalg='sha512')
            )
    authz_policy = ACLAuthorizationPolicy()
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('calendar.page', '/')
    config.add_route('login.page', '/login')
    config.add_route('daily_list.json',             '/json/daily_list/{year:\d+}-{month:\d+}-{day:\d+}')
    config.add_route('vertical_daily_list.json',    '/json/vert_daily_list/{year:\d+}-{month:\d+}-{day:\d+}')
    config.add_route('detail_info.json',            '/json/detail_info/{id:\d+}')
    config.add_route('update_detail_info.json',     '/json/detail_info/{id:\d+}/update')
    config.scan()
    return config.make_wsgi_app()

