from django.urls import path
from .views import *


urlpatterns = [

# AUTH
    
    path('register', RegisterView.as_view(), name='registration'),
    path('login', LoginView.as_view(), name= 'Login'),
    path('logout', LogoutView.as_view(), name= 'Logout'),



# PRODUCT 

    path('products', GetProducts, name='getproducts'),
    path('products/<str:pk>/', GetProduct, name='getproduct'),

# search

    path('search_products', SearchProducts, name='searchproducts'),


# CART

    path('save_cart_items/', SaveCartItems.as_view(), name='save_cart_items'),
    path('user_cart_items/', user_cart_items, name='user_cart_items'),
    path('remove_cart_item/<int:cart_item_id>/', RemoveCartItem.as_view(), name='remove_cart_item'),
 


# ORDER
 
    path('place_order/', place_order, name='place_order'),
    path('user_delivered/', UserDeliveredAPIView.as_view(), name='user_delivered'),


# REVIEW

 path('add_review/', add_review, name='add_review'),
 path('product/<int:product_id>/reviews/', ProductReviewsView.as_view(), name='product_reviews'),
    


# ADMIN
    # users
    path('users/', MyUsersListCreateAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', MyUsersRetrieveUpdateDestroyAPIView.as_view(), name='user-detail'),

    # product
    path('createproducts/', create_product, name='product-create'),
    path('adminproducts/', ProductDetailView.as_view(), name='product-detail'),

    # edit product
    path('editproduct/<int:pk>', EditProduct.as_view(), name='edit_product'),

    # Order
    path('admin-order/', OrderDetailsListView.as_view(), name='admin-order'),
    path('admin-order/<int:pk>/', MarkOrderDeliveredView.as_view(), name='mark-delivered'),

]