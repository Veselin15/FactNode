from django.contrib import admin
from .models import Category, Fact, FactSource
from .choices import FactStatus


class FactSourceInline(admin.TabularInline):
    """
    Allows adding multiple sources (URLs) directly when editing a Fact.
    """
    model = FactSource
    extra = 1  # Shows one empty row by default


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Fact)
class FactAdmin(admin.ModelAdmin):
    """
    The main control center for managing facts.
    Includes custom actions to approve/reject facts quickly.
    """
    list_display = (
        'title',
        'author',
        'category',
        'status',
        'score',
        'created_at'
    )
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('title', 'content', 'author__username')

    # Auto-fill the slug field from the title
    prepopulated_fields = {'slug': ('title',)}

    # Add the sources inline
    inlines = [FactSourceInline]

    # Custom Bulk Actions
    actions = ['approve_facts', 'reject_facts']

    @admin.action(description='Mark selected facts as Approved')
    def approve_facts(self, request, queryset):
        """Bulk action to approve facts."""
        updated_count = queryset.update(status=FactStatus.APPROVED)
        self.message_user(request, f"{updated_count} facts were successfully approved.")

    @admin.action(description='Mark selected facts as Rejected')
    def reject_facts(self, request, queryset):
        """Bulk action to reject facts."""
        updated_count = queryset.update(status=FactStatus.REJECTED)
        self.message_user(request, f"{updated_count} facts were rejected.")