from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404


from django.http import HttpResponse, Http404, HttpResponseBadRequest

from django.http import JsonResponse
from django.views.decorators.http import require_POST


from .models import *

from .serializer import *

from .serializer import UserRegistrationSerializer
from rest_framework import generics, permissions



# REGISTRATION VIEW

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User Registered Successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# LOGIN VIEW


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)  # Maintain session (optional, can be removed)
                refresh = RefreshToken.for_user(user)
                
                # Fetch user's cart data and serialize it
                user_cart_data = UserCart.objects.filter(user=user)
                user_cart_serializer = UserCartSerializer(user_cart_data, many=True)

                is_admin = User.objects.filter(username=username, is_staff=True).exists()
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'email': user.email,
                    'is_admin': is_admin,
                     'User_Id': user.id,
                    'cart_items': user_cart_serializer.data,  # Include user's cart data
                    
                }, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    def post(self, request):
        logout(request)  # Logout user from session
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)








# VIEW PRODUCTS

@api_view(['GET'])
def GetProducts(request):
    products = Product.objects.order_by('-rating')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def GetProduct(request,pk):
    product = Product.objects.get(_id= pk)
    serializer = ProductSerializer(product, many = False)
    
    return Response(serializer.data)

#search

@api_view(['GET'])
def SearchProducts(request):
    keyword = request.GET.get('search', '')  # Get the search keyword from the query parameter
    if keyword:
        # Filter products based on the name containing the keyword (case-insensitive)
        products = Product.objects.filter(name__icontains=keyword).order_by('-rating')
    else:
        # If no keyword provided, return all products
        products = Product.objects.order_by('-rating')

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)




# CART


class SaveCartItems(APIView):
    def post(self, request, format=None):
        serializer = AddUserCartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET'])
def user_cart_items(request):
    # Get the user ID from the query parameters
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch cart items related to the user ID where delivered is false
    cart_items = UserCart.objects.filter(user_id=user_id, delivered=False)
    serializer = UserCartSerializer(cart_items, many=True)
    
    return Response(serializer.data)



class RemoveCartItem(APIView):
    def post(self, request, cart_item_id):
        try:
            cart_item = UserCart.objects.get(id=cart_item_id)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)  # No content on successful deletion
        except UserCart.DoesNotExist:
            return Response({'error': 'Cart item does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:  # Catch any other unexpected exceptions
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        





# ORDER


@api_view(['POST'])
def place_order(request):
    if request.method == 'POST':
        # Deserialize the request data
        serializer = OrderDetailsSerializer(data=request.data)
        if serializer.is_valid():
            # Save the order details
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class UserDeliveredAPIView(generics.ListAPIView):
    serializer_class = UserDeliveredSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            return OrderDetails.objects.filter(user_cart__user_id=user_id, delivered=True)
        else:
            return OrderDetails.objects.none()



# Review

@api_view(['POST'])
def add_review(request):
    if request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProductReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id)



# ADMIN......Users

class MyUsersListCreateAPIView(generics.ListCreateAPIView):
    queryset = MyUsers.objects.all()
    serializer_class = MyUsersSerializer
    

class MyUsersRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MyUsers.objects.all()
    serializer_class = MyUsersSerializer
    


# product


@api_view(['POST'])
def create_product(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

   
    


    # edit product

class EditProduct(APIView):
    def get_object(self, pk):
        return get_object_or_404(Product, pk=pk)

    def put(self, request, pk):
        try:
            product = self.get_object(pk)
        except Product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EditProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            product = self.get_object(pk)
            product.delete()
            return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


    # Order

class OrderDetailsListView(generics.ListAPIView):
    queryset = OrderDetails.objects.all()
    serializer_class = OrderDetailsSerializer


class MarkOrderDeliveredView(generics.UpdateAPIView):
    queryset = OrderDetails.objects.all()
    serializer_class = OrderDetailsSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delivered = True
        instance.save()
        return Response({'message': 'Order marked as delivered successfully'}, status=status.HTTP_200_OK)