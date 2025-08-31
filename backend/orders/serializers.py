from rest_framework import serializers
from .models import Order, OrderItem, OrderItemImage
import json


class OrderItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemImage
        fields = ["id", "image"]


class OrderItemSerializer(serializers.ModelSerializer):
    images = OrderItemImageSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "order_name", "order_details", "quantity", "price", "images"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_payload = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["customer"]

    def create(self, validated_data):
        request = self.context.get("request")

        # Extract items_payload before creating the order
        items_data = validated_data.pop("items_payload", None)
        items_data = self._coerce_items(items_data)

        # Create order with logged-in user
        order = Order.objects.create(customer=request.user, **validated_data)

        # Create order items
        for idx, item_data in enumerate(items_data):
            order_item = OrderItem.objects.create(order=order, **item_data)

            # Save uploaded images for this item
            files = request.FILES.getlist(f"item_images_{idx}")
            for f in files:
                OrderItemImage.objects.create(item=order_item, image=f)

        # Update total price
        order.update_total_price()

        return order

    def update(self, instance, validated_data):
        validated_data.pop("customer", None)  # Prevent changing customer
        return super().update(instance, validated_data)

    def _coerce_items(self, items_data):
        if not items_data:
            return []
        if isinstance(items_data, str):
            return json.loads(items_data)
        return items_data
