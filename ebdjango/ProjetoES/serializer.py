from rest_framework import serializers

from ProjetoES.models import KitchenStaff


class KitchenStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = KitchenStaff
        fields = ('id', 'name', 'password')
