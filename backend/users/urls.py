from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import RegisterView, LoginView, LogoutView, CustomerListView, StaffListView, current_user, ForgotPasswordView, ResetPasswordView

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"), # Custom login view
    path("logout/", LogoutView.as_view(), name="logout"),
    path("user/me/", current_user, name="current-user"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/<str:uidb64>/<str:token>/", ResetPasswordView.as_view(), name="reset-password"),

    # JWT built-in endpoints (recommended)
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    # Admin-only user lists
    path("users/customers/", CustomerListView.as_view(), name="customer-list"),
    path("users/staff/", StaffListView.as_view(), name="staff-list"),
]
