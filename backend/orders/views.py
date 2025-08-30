from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_staff:
            return self.queryset.filter(customer=user)
        return self.queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.update_total_price()

    def perform_destroy(self, instance):
        if instance.status in [Order.Status.COMPLETED, Order.Status.REJECTED]:
            return Response(
                {"detail": "पूरा वा अस्वीकृत अर्डर मेटाउन मिल्दैन।"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        instance.delete()

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        order = self.get_object()
        user = request.user

        if not user.is_staff and order.customer != user:
            return Response({"detail": "अस्वीकृत"}, status=status.HTTP_403_FORBIDDEN)

        if order.status not in [Order.Status.COMPLETED, Order.Status.REJECTED]:
            order.status = Order.Status.REJECTED
            order.save()

        return Response(self.get_serializer(order).data)

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def reports(self, request):
        total_orders = self.queryset.count()
        completed = self.queryset.filter(status=Order.Status.COMPLETED).count()
        rejected = self.queryset.filter(status=Order.Status.REJECTED).count()
        pending = self.queryset.filter(status=Order.Status.PENDING).count()
        total_revenue = sum(
            order.total_price or 0
            for order in self.queryset.filter(status=Order.Status.COMPLETED)
        )

        return Response({
            "कुल अर्डर": total_orders,
            "पूरा भएको": completed,
            "अस्वीकृत": rejected,
            "प्रक्रियामा": pending,
            "जम्मा आम्दानी": total_revenue,
        })
