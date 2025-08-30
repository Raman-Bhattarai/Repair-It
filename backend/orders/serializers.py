from rest_framework import serializers
from .models import Order, OrderItem, OrderItemImage
import json

class OrderItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemImage
        fields = ['id', 'image']

class OrderItemSerializer(serializers.ModelSerializer):
    images = OrderItemImageSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order_name', 'order_details', 'quantity', 'price', 'images']

class OrderSerializer(serializers.ModelSerializer):
    items = serializers.JSONField(write_only=True)  # accept JSON from frontend
    class Meta:
        model = Order
        fields = ['id', 'customer', 'status', 'total_price', 'items', 'created_at', 'updated_at']
        read_only_fields = ['customer', 'total_price']

    def create(self, validated_data):
        request = self.context.get("request")
        items_data = validated_data.pop("items", [])

        # If it’s a string (from frontend JSON), parse it
        if isinstance(items_data, str):
            import json
            items_data = json.loads(items_data)

        order = Order.objects.create(customer=request.user, **validated_data)

        for idx, item_data in enumerate(items_data):
            item = OrderItem.objects.create(
                order=order,
                order_name=item_data.get("order_name"),
                order_details=item_data.get("order_details", ""),
                quantity=item_data.get("quantity", 1),
                price=0
            )

            # Attach files
            for f in request.FILES.getlist(f"item_images_{idx}"):
                OrderItemImage.objects.create(order_item=item, image=f)

        order.update_total_price()
        return order


    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        # Update items
        existing_items = {item.id: item for item in instance.items.all()}
        for item_data in items_data:
            images_data = item_data.pop('images', [])
            item_id = item_data.get('id')
            if item_id:
                item = existing_items.pop(item_id, None)
                if item:
                    item.order_name = item_data.get('order_name', item.order_name)
                    item.order_details = item_data.get('order_details', item.order_details)
                    item.quantity = item_data.get('quantity', item.quantity)
                    item.price = item_data.get('price', item.price)
                    item.save()

                    # Handle images
                    existing_images = {image.id: image for image in item.images.all()}
                    for image_data in images_data:
                        image_id = image_data.get('id')
                        if image_id:
                            image = existing_images.pop(image_id, None)
                            if image:
                                image.image = image_data.get('image', image.image)
                                image.save()
                        else:
                            OrderItemImage.objects.create(item=item, **image_data)

                    for image in existing_images.values():
                        image.delete()

            else:
                new_item = OrderItem.objects.create(order=instance, **item_data)
                for image_data in images_data:
                    OrderItemImage.objects.create(item=new_item, **image_data)

        # Delete removed items
        for item in existing_items.values():
            item.delete()

        instance.update_total_price()
        return instance
