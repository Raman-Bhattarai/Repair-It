from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from .models import Order, OrderItem, OrderItemImage
from .serializers import OrderSerializer
import json

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer=user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        serializer.save() # DO NOT pass customer here; serializer already handles it

    def perform_update(self, serializer):
        serializer.save()  # update logic is handled in serializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status in [Order.Status.COMPLETED, Order.Status.REJECTED]:
            return Response(
                {"detail": "पूरा वा अस्वीकृत अर्डर मेटाउन मिल्दैन।"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        order = self.get_object()
        user = request.user

        if not user.is_staff and order.customer != user:
            return Response({"detail": "अस्वीकृत"}, status=status.HTTP_403_FORBIDDEN)

        if order.status in [Order.Status.COMPLETED, Order.Status.REJECTED]:
            return Response({"detail": "यो अर्डर रद्द गर्न मिल्दैन।"}, status=400)

        if order.status == Order.Status.CANCELLED:
            return Response({"detail": "अर्डर पहिले नै रद्द गरिएको छ।"}, status=400)

        order.status = Order.Status.CANCELLED
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def reports(self, request):
        qs = Order.objects.all()  # admins see all orders
        total_orders = qs.count()
        completed = qs.filter(status=Order.Status.COMPLETED).count()
        rejected = qs.filter(status=Order.Status.REJECTED).count()
        pending = qs.filter(status=Order.Status.PENDING).count()
        total_revenue = sum((o.total_price or 0) for o in qs.filter(status=Order.Status.COMPLETED))

        return Response({
            "कुल अर्डर": total_orders,
            "पूरा भएको": completed,
            "अस्वीकृत": rejected,
            "प्रक्रियामा": pending,
            "जम्मा आम्दानी": total_revenue,
        })
