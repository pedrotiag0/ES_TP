from django.db import models

# Create your models here.
#
# Comandos para o efeito:
# python manage.py makemigrations ProjetoES
# python manage.py migrate ProjetoES


class KitchenStaff(models.Model):
    id = models.AutoField(primary_key=True)             # AutoIncrement Id
    name = models.CharField(max_length=64)              # Name
    password = models.CharField(max_length=256)         # Password

    class Meta:
        db_table = 'User'
