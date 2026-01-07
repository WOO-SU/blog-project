from django.apps import AppConfig

class InteractionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    
    # 1. NAME: Must match the directory path exactly.
    name = 'apps.interactions'
    
    # 2. LABEL: Must be unique across the project. 
    # This prefix is used for DB tables (e.g., 'interactions_like').
    label = 'interactions'
