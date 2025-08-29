from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Normal users see only their own orders
        if not user.is_staff and not user.is_superuser:
            return self.queryset.filter(customer=user)
        return self.queryset

    def create(self, request, *args, **kwargs):
        """Customer creates an order"""
        items_data = request.data.pop("items", [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order = serializer.save(customer=request.user)

        # Create order items
        for item in items_data:
            OrderItem.objects.create(
                order=order,
                order_name=item.get("order_name"),
                order_details=item.get("order_details", ""),
                quantity=item.get("quantity", 1),
                price=item.get("price", 0.00),
                images=item.get("images", None)
            )

        order.update_total_price()
        return Response(self.get_serializer(order).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Update order (staff can adjust price/status, customer can update/cancel)"""
        order = self.get_object()
        user = request.user
        items_data = request.data.pop("items", [])

        # Customers cannot change other customers’ orders
        if not user.is_staff and order.customer != user:
            return Response({"detail": "अस्वीकृत"}, status=status.HTTP_403_FORBIDDEN)

        # Prevent customers from changing price/status directly
        if not user.is_staff:
            request.data.pop("status", None)
            request.data.pop("total_price", None)

        # Apply updates
        response = super().update(request, *args, **kwargs)

        # Update items if provided
        if items_data:
            order.items.all().delete()
            for item in items_data:
                OrderItem.objects.create(
                    order=order,
                    order_name=item.get("order_name"),
                    order_details=item.get("order_details", ""),
                    quantity=item.get("quantity", 1),
                    price=item.get("price", 0.00),
                    images=item.get("images", None)
                )
            order.update_total_price()

        return response

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        """Allow customer or staff to cancel"""
        order = self.get_object()
        user = request.user

        if not user.is_staff and order.customer != user:
            return Response({"detail": "अस्वीकृत"}, status=status.HTTP_403_FORBIDDEN)

        if order.status not in ["CANCELLED", "COMPLETED"]:
            order.status = "CANCELLED"
            order.save()

        return Response(self.get_serializer(order).data)

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def reports(self, request):
        """Admin reporting (basic)"""
        total_orders = self.queryset.count()
        completed = self.queryset.filter(status="COMPLETED").count()
        ongoing = self.queryset.filter(status="ON_GOING").count()
        cancelled = self.queryset.filter(status="CANCELLED").count()
        total_revenue = sum(order.total_price for order in self.queryset.filter(status="COMPLETED"))

        return Response({
            "total_orders": total_orders,
            "completed": completed,
            "ongoing": ongoing,
            "cancelled": cancelled,
            "total_revenue": total_revenue,
        })
