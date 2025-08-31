from django.db import models
from django.conf import settings
from decimal import Decimal


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'प्रक्रियामा'
        COMPLETED = 'COMPLETED', 'पूरा भएको'
        REJECTED = 'REJECTED', 'अस्वीकृत'
        CANCELLED = 'CANCELLED', 'रद्द गरिएको'

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Do NOT block save here; enforce immutability in the view/serializer
    def update_total_price(self):
        total = Decimal("0.00")
        for item in self.items.all():
            total += item.total_price
        self.total_price = total
        super().save(update_fields=["total_price", "updated_at"])

    def __str__(self):
        return f"Order {self.id} by {self.customer}"


class OrderItem(models.Model):
    class Appliance(models.TextChoices):
        FRIDGE = 'FRIDGE', 'फ्रिज'
        WASHING_MACHINE = 'WASHING_MACHINE', 'वाशिङ मेसिन'
        OVEN = 'OVEN', 'अभन'
        TV = 'TV', 'टेलिभिजन'
        FAN = 'FAN', 'पंखा'
        OTHER = 'OTHER', 'अन्य'

    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    order_name = models.CharField(max_length=50, choices=Appliance.choices)
    order_details = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @property
    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.order_name} - {self.order.id}"

    def delete(self, *args, **kwargs):
        order = self.order
        super().delete(*args, **kwargs)
        order.update_total_price()


class OrderItemImage(models.Model):
    item = models.ForeignKey(OrderItem, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='order_item_images/')

    def __str__(self):
        return f"Image for {self.item}"
