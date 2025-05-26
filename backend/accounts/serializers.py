from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    filename = serializers.ReadOnlyField(source='filename')

    class Meta:
        model = Document
        fields = ['id', 'file', 'filename', 'uploaded_at']
