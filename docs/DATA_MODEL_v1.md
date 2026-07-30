# Kitchen Dream OS — Data Model v1

## Core entities

### Recipe
- id
- name
- category
- servings
- cooking_time
- ingredients
- preparation_template
- cooking_steps
- freezer_links

### Preparation Batch
Represents a production event during the big preparation day.

Fields:
- batch_id
- created_date
- items
- packaging_type
- storage_location
- status

### Freezer Item
Represents a physical vacuum bag/container.

Fields:
- item_id
- name
- quantity
- unit
- storage_type
- frozen_date
- expiry_date
- linked_recipe
- status

### Meal Plan
Calendar layer.

Fields:
- date
- meal_type
- recipe
- required_freezer_item
- preparation_status

### Shopping List
Fields:
- ingredient
- quantity
- category
- purchased

## Main relationship

Ingredient -> Preparation -> Freezer Item -> Recipe -> Meal Plan
