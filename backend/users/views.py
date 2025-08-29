from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, ResetPasswordSerializer
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from .serializers import ForgotPasswordSerializer
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings


# Register endpoint
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


# Custom Login using simplejwt
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)


# Logout (blacklist refresh token)
class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


# Customers endpoint (admin only)
class CustomerListView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(is_staff=False)


# Staff endpoint (admin only)
class StaffListView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(is_staff=True)


# Get currently authenticated user
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"email": "यो इमेल कुनै प्रयोगकर्तासँग मेल खाँदैन।"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate JWT tokens specifically for password reset
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Encode user id for frontend (optional)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Create frontend reset URL (frontend should handle JWT verification)
        reset_url = f"http://localhost:3000/reset-password/{uid}/{access_token}/"

        # Send email
        send_mail(
            subject="पासवर्ड रिसेट गर्नुहोस्",
            message=f"पासवर्ड रिसेट गर्न यस लिंकमा क्लिक गर्नुहोस्:\n{reset_url}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )

        return Response({"message": "पासवर्ड रिसेट लिंक तपाईंको इमेलमा पठाइयो।"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "अमान्य प्रयोगकर्ता।"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify JWT token
        try:
            AccessToken(token)  # Will raise TokenError if invalid
        except TokenError:
            return Response({"error": "अमान्य वा समय सकिएको लिंक।"}, status=status.HTTP_400_BAD_REQUEST)

        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"message": "पासवर्ड सफलतापूर्वक परिवर्तन भयो।"}, status=status.HTTP_200_OK)

