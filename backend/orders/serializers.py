from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    get_total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "order_name", "order_details", "quantity", "price", "images", "get_total_price"]

    def get_total_price(self, obj):
        return obj.get_total_price()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="customer.username", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "customer_name",
            "status",
            "total_price",
            "created_at",
            "updated_at",
            "items",
        ]
        read_only_fields = ["total_price", "customer"]

