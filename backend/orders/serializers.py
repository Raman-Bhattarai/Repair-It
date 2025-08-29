from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    get_total_price = serializers.SerializerMethodField()
    order_name_display = serializers.CharField(source="get_order_name_display", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "order_name",
            "order_name_display",  # Nepali/label field
            "order_details",
            "quantity",
            "price",
            "images",
            "get_total_price",
        ]

    def get_total_price(self, obj):
        return obj.get_total_price()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "status",
            "status_display",  # Nepali/label field
            "total_price",
            "created_at",
            "updated_at",
            "items",
        ]
        read_only_fields = ["total_price", "customer"]
