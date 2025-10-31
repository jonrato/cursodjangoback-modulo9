from django.urls import path
from .views import fetch_logs, fetch_and_store_logs

urlpatterns = [
    path("fetch-logs/", fetch_and_store_logs)
]
