# Kitchen Dream OS — Product Specification v0.1

## Problem

Families spend too much time deciding what to cook, buying products repeatedly and losing track of frozen preparations.

## Solution

A visual kitchen management system built around batch cooking.

## User Flow

1. Create monthly menu
2. Generate shopping list
3. Preparation day checklist
4. Create vacuum packages
5. Track freezer inventory
6. Cook from prepared components

## Main Entities

### Recipe
Contains:
- ingredients
- cooking steps
- preparation method
- related freezer items

### Preparation
Contains:
- semi-finished product
- quantity
- packaging
- storage location
- expiration

### Freezer Item
Contains:
- package ID
- status
- quantity
- linked recipe

### Meal Plan
Contains:
- date
- breakfast/lunch/dinner (future)
- required preparation

## Design Principle

The app should feel like a personal kitchen assistant, not a database.
