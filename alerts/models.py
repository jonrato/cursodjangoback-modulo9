from django.db import models

class LogEntry(models.Model):
    LEVEL_CHOICES = [
        ("DEBUG", "DEBUG"),
        ("INFO", "INFO"),
        ("WARNING", "WARNING"),
        ("ERROR", "ERROR"),
        ("CRITICAL", "CRITICAL"),
        ("EMERGENCY", "EMERGENCY"),
    ]

    timestamp = models.CharField(max_length=50)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    message = models.TextField()
    metadata = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"[{self.timestamp}] {self.level}: {self.message}"