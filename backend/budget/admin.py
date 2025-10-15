from django.contrib import admin
from .models import Category, Transaction, Budget
# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name' , 'type' , 'user' , 'created_at']
    list_filter = ['type' , 'user']
    search_fields = ['name']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['description', 'amount', 'type', 'category', 'date', 'user']
    list_filter = ['type', 'date', 'category']
    search_fields = ['description']
    date_hierarchy = 'date'


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    ist_display = ['user', 'month', 'amount', 'created_at']
    list_filter = ['user', 'month']