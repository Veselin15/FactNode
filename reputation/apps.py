from django.apps import AppConfig

class ReputationConfig(AppConfig):
    name = 'reputation'

    def ready(self):
        # This import registers the signals when the app starts
        import reputation.signals