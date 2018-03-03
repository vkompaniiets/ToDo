from django.contrib import admin
from entry.models import Entry


class EntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_done')


admin.site.register(Entry, EntryAdmin)
