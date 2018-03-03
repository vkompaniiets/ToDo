from django.urls import path
from django.views.generic import RedirectView
from account import views

urlpatterns = [
    path('', RedirectView.as_view(url='/login/')),
    path('login/', views.account_login, name='login'),
    path('logout/', views.account_logout, name='logout'),
]
