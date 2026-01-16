from django.apps import AppConfig

class InteractionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    
    name = 'apps.interactions'
    # This prefix is used for DB tables (e.g., 'interactions_like').
    label = 'interactions'
