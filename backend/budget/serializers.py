from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Transaction, Budget

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'created_at']
        read_only_fields = ['created_at']

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'category', 'category_name', 'description', 'amount', 'type', 'date', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'month', 'amount', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']