from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Fields to display in admin list view
    list_display = ("username", "email", "phone", "is_staff", "is_superuser")
    search_fields = ("username", "email", "phone")
    list_filter = ("is_staff", "is_superuser", "is_active")

    # Fieldsets for detail/edit page in admin
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("email", "phone", "address")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    # Fields for "Add new user" form in admin
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "phone", "address", "password1", "password2", "is_staff", "is_superuser"),
        }),
    )
