from rest_framework import serializers

from django.contrib.auth import get_user_model   # Consider this

from .models import *





# AUTH

User = get_user_model()  # Use get_user_model for flexibility

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required= True)
    password = serializers.CharField(required= True, write_only= True)



class AddUserCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCart
        fields = ('user', 'product', 'quantity', 'total_price')








# PRODUCT

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'






# CART

class UserCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCart
        fields = '__all__'





# ORDER

class OrderDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetails
        fields = '__all__'


class UserDeliveredSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='user_cart.product.name', read_only=True)
    product_id = serializers.IntegerField(source='user_cart.product._id', read_only=True)
    product_image = serializers.ImageField(source='user_cart.product.image', read_only=True)
    quantity = serializers.IntegerField(source='user_cart.quantity', read_only=True)
    user = serializers.PrimaryKeyRelatedField(source='user_cart.user', read_only=True)

    class Meta:
        model = OrderDetails
        fields = ['id', 'user', 'name', 'building_number', 'locality', 'pin_code', 'total_price',
                  'date_created', 'is_paid', 'delivered', 'date_delivered',
                  'product_name', 'product_id', 'product_image', 'quantity', 'review_added']




# REVIEW

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'




# ADMIN

class MyUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUsers
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']


class EditProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['_id', 'price', 'countInStock']