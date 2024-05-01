from django.conf import settings
import razorpay


client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
client.set_app_details({"title": "my_test_site", "version": "1.0"})




