from django.apps import AppConfig

class FactsConfig(AppConfig):
    name = 'facts'

    def ready(self):
        import facts.signals