from django.contrib import admin
# from rest_framework.authtoken.admin import TokenAdmin
# from rest_framework.authtoken.models import Token

from .models import *

# Register your models here.


# class CustomTokenAdmin(TokenAdmin):
#     search_fields = ('user__username',)  # Search tokens by the username of the associated user
# admin.site.register(Token, CustomTokenAdmin)




admin.site.register(MyUsers)
admin.site.register(Product)
admin.site.register(Review)
# admin.site.register(Order)
# admin.site.register(OrderItem)
# admin.site.register(ShippingAddress)
# admin.site.register(Cart)
# admin.site.register(CartItem)
admin.site.register(UserCart)
admin.site.register(OrderDetails)