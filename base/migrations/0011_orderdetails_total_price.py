# Generated by Django 5.0.3 on 2024-04-15 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_orderdetails'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderdetails',
            name='total_price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
