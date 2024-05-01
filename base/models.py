from django.db import models
from django.contrib.auth.models import User,AbstractUser
from django.utils import timezone
from django.db.models import Sum
from django.db.models import F
from django.utils import timezone

# Create your models here.



class MyUsers(AbstractUser):
    email = models.EmailField(unique=True)  # Ensure unique email addresses

    USERNAME_FIELD = 'username'  # Update username field to email
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.username





class Product(models.Model):
    user = models.ForeignKey(MyUsers, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    total_orders = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)
    total_star = models.IntegerField(null=True, blank=True, default=0)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.numReviews > 0:
            self.rating = self.total_star / self.numReviews
        else:
            self.rating = 0
        super().save(*args, **kwargs)



class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(MyUsers, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)
    orderId = models.IntegerField(null=True, blank=True, default=1)
    
    def __str__(self):
        return f'{self.rating} - {self.user} - {self.product}'

    def save(self, *args, **kwargs):
        if self._state.adding:  # Check if it's a new review being added
            # Update numReviews and total_star of the associated product
            self.product.numReviews += 1
            self.product.total_star += self.rating
            self.product.save()  # Save the product after updating its fields
            # Update review_added field of the corresponding OrderDetails
            try:
                order_detail = OrderDetails.objects.get(pk=self.orderId)
                order_detail.review_added = True
                order_detail.save()
            except OrderDetails.DoesNotExist:
                pass  # Handle the case where the corresponding OrderDetails doesn't exist
        super().save(*args, **kwargs)  # Call the original save method to save the review


    




class UserCart(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(MyUsers, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)  # Allow null during migration
    quantity = models.IntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    order_placed = models.BooleanField(default=False)
    delivered = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} - {self.product.name} --cart id: {self.id}'




class OrderDetails(models.Model):
    user_cart = models.OneToOneField(UserCart, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    building_number = models.CharField(max_length=100)
    locality = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
    delivered = models.BooleanField(default=False)
    date_delivered = models.DateTimeField(null=True, blank=True)  # New field
    review_added = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Order for {self.user_cart.user.username} - {self.user_cart.product.name}"

    def save(self, *args, **kwargs):
        # Override the save method to update total_price based on UserCart
        self.total_price = self.user_cart.product.price * self.user_cart.quantity

        if self.pk is None:
            # New order being created
            quantity_ordered = self.user_cart.quantity
            self.user_cart.product.countInStock -= quantity_ordered
            self.user_cart.product.total_orders += quantity_ordered
            self.user_cart.product.save()

        # Set order_placed to True for the associated UserCart
        self.user_cart.order_placed = True
        self.user_cart.save()

        # Check if delivered field is True, then update delivered field of associated UserCart
        if self.delivered and not self.user_cart.delivered:
            self.user_cart.delivered = True
            self.user_cart.save()
            # Update date_delivered when delivered becomes True
            self.date_delivered = timezone.now()
            # Set is_paid to True when delivered becomes True
            self.is_paid = True

        super(OrderDetails, self).save(*args, **kwargs)

















# class OrderDetails(models.Model):
#     user_cart = models.OneToOneField(UserCart, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)
#     building_number = models.CharField(max_length=100)
#     locality = models.CharField(max_length=100)
#     pin_code = models.CharField(max_length=10)
#     total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
#     date_created = models.DateTimeField(auto_now_add=True)
#     is_paid = models.BooleanField(default=False)
#     delivered = models.BooleanField(default=False)
#     date_delivered = models.DateTimeField(null=True, blank=True)  # New field
#     review_added = models.BooleanField(default= False)
#     order_id = models.AutoField(primary_key= True, default= 1)

#     def __str__(self):
#         return f"Order for {self.user_cart.user.username} - {self.user_cart.product.name}"

#     def save(self, *args, **kwargs):
#         # Override the save method to update total_price based on UserCart
#         self.total_price = self.user_cart.product.price * self.user_cart.quantity

#         if self.pk is None:
#             # New order being created
#             quantity_ordered = self.user_cart.quantity
#             self.user_cart.product.countInStock -= quantity_ordered
#             self.user_cart.product.total_orders += quantity_ordered
#             self.user_cart.product.save()

#         # Set order_placed to True for the associated UserCart
#         self.user_cart.order_placed = True
#         self.user_cart.save()

#         # Check if delivered field is True, then update delivered field of associated UserCart
#         if self.delivered and not self.user_cart.delivered:
#             self.user_cart.delivered = True
#             self.user_cart.save()
#             # Update date_delivered when delivered becomes True
#             self.date_delivered = timezone.now()

#         super(OrderDetails, self).save(*args, **kwargs) 










####




# class Order(models.Model):
#     user = models.ForeignKey(MyUsers, on_delete=models.SET_NULL, null=True)
#     paymentMethod = models.CharField(max_length=200, null=True, blank=True)
#     taxPrice = models.DecimalField(
#         max_digits=7, decimal_places=2, null=True, blank=True)
#     shippingPrice = models.DecimalField(
#         max_digits=7, decimal_places=2, null=True, blank=True)
#     totalPrice = models.DecimalField(
#         max_digits=7, decimal_places=2, null=True, blank=True)
#     isPaid = models.BooleanField(default=False)
#     paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
#     isDelivered = models.BooleanField(default=False)
#     deliveredAt = models.DateTimeField(
#         auto_now_add=False, null=True, blank=True)
#     createdAt = models.DateTimeField(auto_now_add=True)
#     _id = models.AutoField(primary_key=True, editable=False)

#     def __str__(self):
#         return str(self.createdAt)
    

# class OrderItem(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
#     order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
#     name = models.CharField(max_length=200, null=True, blank=True)
#     qty = models.IntegerField(null=True, blank=True, default=0)
#     price = models.DecimalField(
#         max_digits=7, decimal_places=2, null=True, blank=True)
#     image = models.CharField(max_length=200, null=True, blank=True)
#     _id = models.AutoField(primary_key=True, editable=False)

#     def __str__(self):
#         return str(self.name)   
    

# class ShippingAddress(models.Model):
#     order = models.OneToOneField(
#         Order, on_delete=models.CASCADE, null=True, blank=True)
#     address = models.CharField(max_length=200, null=True, blank=True)
#     city = models.CharField(max_length=200, null=True, blank=True)
#     postalCode = models.CharField(max_length=200, null=True, blank=True)
#     country = models.CharField(max_length=200, null=True, blank=True)
#     shippingPrice = models.DecimalField(
#         max_digits=7, decimal_places=2, null=True, blank=True)
#     _id = models.AutoField(primary_key=True, editable=False)

#     def __str__(self):
#         return str(self.address)
    


# class Cart(models.Model):
#     user = models.ForeignKey(MyUsers, on_delete=models.CASCADE)
#     items = models.ManyToManyField('Product', through='CartItem')
#     total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

#     def __str__(self):
#         return str(self.user)

# class CartItem(models.Model):
#     cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
#     product = models.ForeignKey('Product', on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField(default=1)

#     def __str__(self):
#         return str(self.product)
    

###

       