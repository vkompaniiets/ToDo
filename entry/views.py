from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.views.generic.base import TemplateView

from rest_framework import status
from rest_framework.response import Response

from entry.models import Entry
from entry.serializers import EntrySerializer


@method_decorator(login_required, name='dispatch')
class EntriesView(TemplateView):
    template_name = 'todo.html'

    def get_context_data(self, **kwargs):
        context = super(EntriesView, self).get_context_data(**kwargs)
        context['entries'] = Entry.objects.all()
        return context


@login_required
def create(request):
    if request.is_ajax():
        name = request.POST.get('name', None)
        if len(name) < 4:
            return Response({'status': 'error', 'error': 'Error: Name must have at least 4 characters!'})
        entry = Entry(name=name, is_done=False)  # новый таск не может быть сразу выполненым
        entry.save()
    return JsonResponse({'status': 'success'}, status=status.HTTP_201_CREATED)


@login_required
def mark_done(request):
    if request.is_ajax():
        task_id = request.POST.get('task_id', None)
        is_done = request.POST.get('is_done', None)
        Entry.objects.filter(id=task_id).update(is_done=is_done)
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error'})


@login_required
def edit_task(request):
    if request.is_ajax():
        task_id = request.POST.get('task_id', None)
        name = request.POST.get('name', None)
        if len(name) < 4:
            return JsonResponse({'status': 'error', 'error': 'Error: Name must have at least 4 characters!'})
        Entry.objects.filter(id=task_id).update(name=name)
    return JsonResponse({'status': 'success'})


@login_required
def delete(request):
    if request.is_ajax():
        task_id = request.POST.get('task_id', None)
        Entry.objects.filter(id=task_id).delete()
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error'})


@login_required
def get_last_id(request):
    last_obj = Entry.objects.latest('id')
    return JsonResponse({'last_id': last_obj.id})
