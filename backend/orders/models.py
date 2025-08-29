from django.db import models
from django.conf import settings


class Order(models.Model):
    STATUS_CHOICES = [
        ("ON_GOING", "चालु"),
        ("COMPLETED", "पूरा भयो"),
        ("CANCELLED", "रद्द भयो"),
        ("REJECTED", "अस्वीकृत"),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ON_GOING"
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def update_total_price(self):
        total = sum(item.get_total_price() for item in self.items.all())
        self.total_price = total
        self.save(update_fields=["total_price"])

    def __str__(self):
        return f"Order #{self.id} by {self.customer.username}"


class OrderItem(models.Model):
    APPLIANCE_CHOICES = [
        ("refrigerator", "Fridge / फ्रिज"),
        ("washing_machine", "Washing Machine / धुने मेशिन"),
        ("ac", "AC / एयर कन्डिसनर"),
        ("tv", "TV / टिभी"),
        ("other", "Other / अन्य"),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )
    order_name = models.CharField(max_length=255, choices=APPLIANCE_CHOICES)
    order_details = models.TextField(blank=True, default="")
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    images = models.ImageField(upload_to="order_images/", blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.order_name}"

    def get_total_price(self):
        return self.quantity * self.price

    def delete(self, *args, **kwargs):
        order = self.order
        super().delete(*args, **kwargs)
        order.update_total_price()
