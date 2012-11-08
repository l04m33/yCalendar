import unittest
import transaction

from pyramid import testing

from .models import DBSession

class TestMyView(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()
        from sqlalchemy import create_engine
        engine = create_engine('sqlite://')
        from .models import (
            Base,
            DetailInfo,
            )
        DBSession.configure(bind=engine)
        Base.metadata.create_all(engine)
        with transaction.manager:
            model = DetailInfo(title='test_title', content='test_content')
            DBSession.add(model)

    def tearDown(self):
        DBSession.remove()
        testing.tearDown()

    # TODO: fix this test!!!!
    def test_it(self):
        from .views import my_view
        request = testing.DummyRequest()
        info = my_view(request)
        self.assertEqual(info['one'].name, 'one')
        self.assertEqual(info['project'], 'yCalendar')

