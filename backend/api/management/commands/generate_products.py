import random

from django.core.management.base import BaseCommand
from api.models import Category, Tag, Product


class Command(BaseCommand):
    help = "Generate random sample categories, tags, and products"

    def handle(self, *args, **kwargs):
        category_names = [
            "Electronics",
            "Books",
            "Clothing",
            "Home",
            "Sports",
        ]

        tag_names = [
            "Portable",
            "Popular",
            "Sale",
            "Durable",
            "Budget",
            "New",
            "Premium",
            "Gift",
            "Eco-Friendly",
            "Limited",
        ]

        product_words = [
            "Wireless",
            "Smart",
            "Portable",
            "Classic",
            "Premium",
            "Compact",
            "Durable",
            "Eco",
            "Modern",
            "Lightweight",
        ]

        product_items = [
            "Headphones",
            "Speaker",
            "Charger",
            "Watch",
            "Laptop Stand",
            "Novel",
            "Cookbook",
            "T-Shirt",
            "Jacket",
            "Shoes",
            "Desk Lamp",
            "Coffee Mug",
            "Storage Basket",
            "Yoga Mat",
            "Basketball",
            "Backpack",
            "Notebook",
            "Blanket",
            "Water Bottle",
            "Keyboard",
        ]

        description_templates = [
            "A {quality} {item} designed for everyday use, comfort, and convenience.",
            "This {item} is {quality} and works well for home, school, work, or travel.",
            "A reliable {item} with a {quality} design and practical features.",
            "A {quality} choice for customers looking for a useful and affordable {item}.",
            "This {quality} {item} is ideal for daily routines and simple organization.",
        ]

        categories = []
        for name in category_names:
            category, _ = Category.objects.get_or_create(name=name)
            categories.append(category)

        tags = []
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=name)
            tags.append(tag)

        created_count = 0

        for i in range(20):
            word = random.choice(product_words)
            item = random.choice(product_items)
            product_name = f"{word} {item}"

            category = random.choice(categories)
            selected_tags = random.sample(tags, random.randint(1, 4))

            description = random.choice(description_templates).format(
                quality=word.lower(),
                item=item.lower()
            )

            product, created = Product.objects.get_or_create(
                name=product_name,
                defaults={
                    "description": description,
                    "category": category,
                },
            )

            product.tags.set(selected_tags)

            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {created_count} new products."
            )
        )