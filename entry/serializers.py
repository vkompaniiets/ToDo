from entry.models import Entry
from rest_framework import serializers


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ('name', 'is_done')
