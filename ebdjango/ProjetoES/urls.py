from django.urls import path
from ProjetoES import views

from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    #path('', views.index, name='index'),
    path('', views.hello),
    path('orders/', views.loginTry),
    path('orders/refresh', views.refreshOrders),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)