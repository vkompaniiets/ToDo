from django.db.models import Model, CharField, BooleanField


class Entry(Model):
    name = CharField(max_length=200)
    is_done = BooleanField(default=False)
