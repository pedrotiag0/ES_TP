from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from clientES import views

urlpatterns = [
    #path('', views.index, name='index'),
    path('', views.mainMenu),
    path('checkup/', views.checkup),
    path('checkout/', views.checkout),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
