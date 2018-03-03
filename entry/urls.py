from django.urls import path

from entry import views

urlpatterns = [
    path('', views.show_all, name='todo'),
    path('mark_done/', views.mark_done, name='mark_done'),
    path('edit_task/', views.edit_task, name='edit_task'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),
    path('get_last_id/', views.get_last_id, name='get_last_id'),
]
