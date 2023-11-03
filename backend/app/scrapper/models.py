from datetime import date, datetime

import mongoengine as me


class Jobs(me.Document):
    job_id = me.LongField(unique=True, required=True)
    title = me.StringField(max_length=255, required=True)
    salary = me.StringField(max_length=50)
    link = me.StringField(max_length=255, required=True)
    company = me.StringField(max_length=50, required=True)
    platform = me.StringField(max_length=20, required=True)
    seen = me.BooleanField(default=False)
    applied = me.BooleanField(default=False)
    applied_date = me.DateField()
    deleted = me.BooleanField(default=False)
    created = me.DateField(default=datetime.now, required=True)

    def serialize(self) -> dict:
        """Creates a dict version of the object

        Returns:
            dict: Returns a dict with all object properties.
        """
        data = {}
        for field in self._fields_ordered:
            if field == "id":
                data[field] = str(getattr(self, field))
            elif isinstance(getattr(self, field), date):
                data[field] = getattr(self, field).strftime("%Y-%m-%d")
            else:
                data[field] = getattr(self, field)

        return data


class Settings(me.Document):
    link_username = me.StringField(required=True)
    link_password = me.StringField(required=True)
    job_title = me.StringField(required=True)
    keywords = me.StringField(default="")
    on_site = me.BooleanField(default=False)
    hybrid = me.BooleanField(default=False)
    remote = me.BooleanField(default=True)
    night_search = me.BooleanField(default=False)
    weekend_search = me.BooleanField(default=False)
    delete_old = me.BooleanField(default=False)
    delete_on_search = me.BooleanField(default=False)

    def serialize(self) -> dict:
        """Creates a dict version of the object

        Returns:
            dict: Returns a dict with all object properties.
        """

        data = {}
        for field in self._fields_ordered:
            if field == "id":
                data[field] = str(getattr(self, field))
            elif isinstance(getattr(self, field), date):
                data[field] = getattr(self, field).strftime("%Y-%m-%d")
            else:
                data[field] = getattr(self, field)

        return data
