from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    읽기는 모두 허용, 수정/삭제는 작성자만 허용
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user