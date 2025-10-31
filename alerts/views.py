import os
import requests
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import LogEntry


@api_view(['GET'])
def fetch_logs(request):
    try:
        api_url = os.getenv("LOGEMITTER_API")
        response = requests.get(api_url)
        return Response(response.json())#
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    

@api_view(['POST'])
def fetch_and_store_logs(request):
    try:
        api_url = os.getenv("LOGEMITTER_API")
        response = requests.get(api_url)
        data = response.json()

        logs = data.get("logs", [])
        last_timestamp = data.get("last_timestamp")

        last_entry = LogEntry.objects.order_by("-timestamp").first()
        last_saved_ts = last_entry.timestamp if last_entry else ""

        saved = 0
        skipped = 0

        for log_obj in logs:
            try:
                if log_obj.get("level") in ["DEBUG", "INFO"]:
                    continue

                if last_saved_ts and log_obj.get("ts") <= last_saved_ts:
                    skipped += 1
                    continue

                LogEntry.objects.create(
                    timestamp=log_obj.get("ts"),
                    level = log_obj.get("level"),
                    message=log_obj.get("event"),
                    metadata={
                        "service":log_obj.get("service"),
                        "env": log_obj.get("env")
                    },
                )
                saved += 1

            except Exception as e:
                print("Erro ao salvar logs", e)
                continue
        return Response({
            "saved": saved,
            "skipped": skipped,
            "detail": "Processo finalizado",
            "last_timestamp": last_timestamp,
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)