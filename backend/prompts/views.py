import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Prompt

REDIS_AVAILABLE = False
r = None

try:
    import redis as redis_lib
    _client = redis_lib.from_url(
        settings.REDIS_URL,
        decode_responses=True,
        socket_connect_timeout=2
    )
    _client.ping()
    r = _client
    REDIS_AVAILABLE = True
except Exception:
    REDIS_AVAILABLE = False


def serialize_prompt(prompt, view_count=None):
    data = {
        "id": prompt.id,
        "title": prompt.title,
        "content": prompt.content,
        "complexity": prompt.complexity,
        "created_at": prompt.created_at.isoformat(),
    }
    if view_count is not None:
        data["view_count"] = view_count
    return data


def validate_prompt_data(data):
    errors = {}
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    complexity = data.get("complexity")

    if len(title) < 3:
        errors["title"] = "Title must be at least 3 characters."
    if len(content) < 20:
        errors["content"] = "Content must be at least 20 characters."
    try:
        complexity = int(complexity)
        if not (1 <= complexity <= 10):
            errors["complexity"] = "Complexity must be between 1 and 10."
    except (TypeError, ValueError):
        errors["complexity"] = "Complexity must be a number between 1 and 10."

    return errors, title, content, complexity


@csrf_exempt
@require_http_methods(["GET", "POST"])
def prompt_list(request):
    if request.method == "GET":
        prompts = Prompt.objects.all()
        return JsonResponse([serialize_prompt(p) for p in prompts], safe=False)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    errors, title, content, complexity = validate_prompt_data(body)
    if errors:
        return JsonResponse({"errors": errors}, status=400)

    prompt = Prompt.objects.create(
        title=title, content=content, complexity=complexity
    )
    return JsonResponse(serialize_prompt(prompt), status=201)


@csrf_exempt
@require_http_methods(["GET"])
def prompt_detail(request, pk):
    try:
        prompt = Prompt.objects.get(pk=pk)
    except Prompt.DoesNotExist:
        return JsonResponse({"error": "Prompt not found."}, status=404)

    if REDIS_AVAILABLE and r:
        view_count = r.incr(f"prompt:{prompt.id}:views")
    else:
        view_count = 0

    return JsonResponse(serialize_prompt(prompt, view_count=view_count))