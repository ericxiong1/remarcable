from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
    
class Tag(models.Model):
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()

    # We protect products by forcing a category to be empty of products before removing one.
    # Another good option is to set a new default category when a category containing prods are deleted.
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products"
    )


    tags = models.ManyToManyField(
        Tag,
        related_name="products",
        blank=True
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name