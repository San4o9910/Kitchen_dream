# Kitchen Dream OS — Database Schema v0.1

## Recipes

Fields:
- id
- name
- category
- portions
- cooking_time
- ingredients
- preparation_template
- instructions
- cost

## Freezer Inventory

Fields:
- package_id
- name
- type (raw / cooked)
- quantity
- created_date
- storage_location
- expiration_date
- linked_recipe
- status

## Preparation Day

Fields:
- task
- recipe
- quantity
- package_count
- status

## Meal Calendar

Fields:
- date
- meal_type
- recipe
- required_packages

## Shopping

Fields:
- ingredient
- quantity
- category
- purchased
