from django.http import JsonResponse
from .models import Product, Category, Tag


def product_list_api(request):
    # Get all products, and also prepare their categories and tags to 
    # avoid having to query multiple times
    products = Product.objects.select_related("category").prefetch_related("tags").all()

    search_query = request.GET.get("q", "")
    selected_category = request.GET.get("category", "")
    selected_tags = request.GET.getlist("tags")
    tag_match = request.GET.get("tag_match", "any")

    if search_query:
        products = products.filter(description__icontains=search_query)

    if selected_category:
        products = products.filter(category_id=selected_category)

    # Add option for AND or OR option for filters to avoid confusion
    if selected_tags:
        # Applying one filter per tag makes the result stricter so
        # products must contain every selected tag, not just one of them.
        if tag_match == "all":
            for tag_id in selected_tags:
                products = products.filter(tags__id=tag_id)
        # A product can match more than one selected tag, so distinct
        # prevents the same product from appearing multiple times.
        else:
            products = products.filter(tags__id__in=selected_tags).distinct()

    product_data = []

    for product in products:
        product_data.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "category": {
                "id": product.category.id,
                "name": product.category.name,
            },
            "tags": [
                {
                    "id": tag.id,
                    "name": tag.name,
                }
                for tag in product.tags.all()
            ],
        })

    category_data = [
        {
            "id": category.id,
            "name": category.name,
        }
        for category in Category.objects.all()
    ]

    tag_data = [
        {
            "id": tag.id,
            "name": tag.name,
        }
        for tag in Tag.objects.all()
    ]

    return JsonResponse({
        "products": product_data,
        "categories": category_data,
        "tags": tag_data,
    })
