from rest_framework import serializers
from .models import Order, OrderItem, OrderItemImage
import json

        
class OrderItemImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)  # use_url=True by default

    class Meta:
        model = OrderItemImage
        fields = ["id", "image"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")
        if request and instance.image:
            rep["image"] = request.build_absolute_uri(instance.image.url)
        return rep



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
            # Remove frontend-only keys
            item_data.pop("remove_image_ids", None)
            item_id = item_data.pop("id", None)

            # Create the OrderItem
            order_item = OrderItem.objects.create(order=order, **item_data)

            # Save uploaded images for this item
            files = request.FILES.getlist(f"item_images_{idx}")
            for f in files:
                OrderItemImage.objects.create(item=order_item, image=f)

        # Update total price
        order.update_total_price()

        return order
    
    def update(self, instance, validated_data):
        request = self.context.get("request")

        # Prevent changing customer
        validated_data.pop("customer", None)

        if request.user.is_staff:
            # Staff can update status and price
            # All other fields are editable by staff
            items_data = validated_data.pop("items_payload", None)
            instance = super().update(instance, validated_data)
            if items_data:
                self._update_items(instance, items_data, request.FILES)
        else:
            # Customer can only update items (name, details, quantity, images)
            validated_data.pop("status", None)
            validated_data.pop("total_price", None)
            instance = super().update(instance, validated_data)
            items_data = self.context["request"].data.get("items_payload")
            if items_data:
                if isinstance(items_data, str):
                    try:
                        items_data = json.loads(items_data)
                    except json.JSONDecodeError:
                        items_data = []
                self._update_items(instance, items_data, request.FILES)

        # Update total price
        instance.update_total_price()
        return instance
                
    def _update_items(self, order, items_data, files_dict):
        """Minimal fix: remove frontend-only fields so Django doesn't crash.
        Keeps your existing logic (customer deletes all items, staff can update status/price)."""
        order.items.all().delete()  # Keep your current delete logic
        for idx, item_data in enumerate(items_data):
            # Remove frontend-only keys
            item_data.pop("remove_image_ids", None)
            item_id = item_data.pop("id", None)  # optional, in case frontend sends id

            # Create the OrderItem safely
            order_item = OrderItem.objects.create(order=order, **item_data)

            # Add uploaded images
            for f in files_dict.getlist(f"item_images_{idx}"):
                OrderItemImage.objects.create(item=order_item, image=f)


    def _coerce_items(self, items_data):
        if not items_data:
            return []
        if isinstance(items_data, str):
            return json.loads(items_data)
        return items_data
