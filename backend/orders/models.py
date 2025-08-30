from django.db import models
from django.conf import settings

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

    def save(self, *args, **kwargs):
        if self.status in [self.Status.COMPLETED, self.Status.REJECTED]:
            raise ValueError("पूरा भएको वा अस्वीकृत अर्डर परिवर्तन गर्न मिल्दैन।")
        super().save(*args, **kwargs)

    def update_total_price(self):
        self.total_price = sum(item.total_price for item in self.items.all())
        self.save()

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
    order_details = models.TextField()
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @property
    def total_price(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.appliance} - {self.order.id}"
    
    def delete(self, *args, **kwargs):
        order = self.order
        super().delete(*args, **kwargs)
        order.calculate_total()


class OrderItemImage(models.Model):
    item = models.ForeignKey(OrderItem, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='order_item_images/')

    def __str__(self):
        return f"Image for {self.item}"

