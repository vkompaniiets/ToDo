from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic.base import TemplateView
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes

from entry.models import Entry
from entry.serializers import EntrySerializer


@method_decorator(login_required, name='dispatch')
class EntriesView(TemplateView):
    template_name = 'todo.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['entries'] = Entry.objects.all()
        return context


@login_required
@api_view(['POST'])
def create(request):
    if request.is_ajax():
        name = request.data['name']
        if len(name) < 4:
            return Response({'status': 'error', 'error': 'Error: Name must have at least 4 characters!'})

        serializer = EntrySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required
@api_view(['POST'])
def mark_done(request):
    if request.is_ajax():
        task_id = request.data['task_id']
        is_done = request.data['is_done']
        Entry.objects.filter(id=task_id).update(is_done=is_done)
        return Response({'status': 'success'})
    else:
        return Response({'status': 'error'})


@login_required
@api_view(['POST'])
def edit_task(request):
    if request.is_ajax():
        task_id = request.data['task_id']
        name = request.data['name']
        if len(name) < 4:
            return Response({'status': 'error', 'error': 'Error: Name must have at least 4 characters!'})
        entry = get_object_or_404(Entry, id=task_id)
        serializer = EntrySerializer(entry, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required
@api_view(['POST'])
def delete(request):
    if request.is_ajax():
        task_id = request.data['task_id']
        Entry.objects.filter(id=task_id).delete()
        return Response({'status': 'success'})
    else:
        return Response({'status': 'error'})


@login_required
@api_view(['GET'])
def get_last_id(request):
    last_obj = Entry.objects.latest('id')
    return Response({'last_id': last_obj.id})
