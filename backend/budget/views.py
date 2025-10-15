from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Sum
from datetime import datetime
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, UserSerializer

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# Category ViewSet
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Transaction ViewSet
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        
        # Filtering
        transaction_type = self.request.query_params.get('type', None)
        category = self.request.query_params.get('category', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        min_amount = self.request.query_params.get('min_amount', None)
        max_amount = self.request.query_params.get('max_amount', None)
        
        if transaction_type:
            queryset = queryset.filter(type=transaction_type)
        if category:
            queryset = queryset.filter(category_id=category)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)
        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Budget ViewSet
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Dashboard Summary
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    user = request.user
    
    # Get date range (current month by default)
    today = datetime.today()
    month = request.query_params.get('month', today.month)
    year = request.query_params.get('year', today.year)
    
    # Calculate totals
    income_total = Transaction.objects.filter(
        user=user, 
        type='income',
        date__month=month,
        date__year=year
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    expense_total = Transaction.objects.filter(
        user=user, 
        type='expense',
        date__month=month,
        date__year=year
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    balance = income_total - expense_total
    
    # Get budget for current month
    try:
        budget_date = datetime(int(year), int(month), 1).date()
        budget = Budget.objects.get(user=user, month=budget_date)
        budget_amount = float(budget.amount)
        budget_remaining = budget_amount - float(expense_total)
        budget_percentage = (float(expense_total) / budget_amount * 100) if budget_amount > 0 else 0
    except Budget.DoesNotExist:
        budget_amount = 0
        budget_remaining = 0
        budget_percentage = 0
    
    # Expenses by category
    expenses_by_category = Transaction.objects.filter(
        user=user,
        type='expense',
        date__month=month,
        date__year=year
    ).values('category__name').annotate(total=Sum('amount')).order_by('-total')
    
    return Response({
        'income_total': income_total,
        'expense_total': expense_total,
        'balance': balance,
        'budget_amount': budget_amount,
        'budget_remaining': budget_remaining,
        'budget_percentage': budget_percentage,
        'expenses_by_category': list(expenses_by_category)
    })