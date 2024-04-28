from rest_framework.authentication import get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission

class IsAuthenticatedWithBearerToken(BasePermission):
    message = 'Authorization header is missing or invalid.'
    def has_permission(self, request, view):
        try:
            auth_header = get_authorization_header(request)
            if not auth_header:
                raise AuthenticationFailed(self.message)
            auth_header = auth_header.decode("utf-8")
            if not auth_header.startswith('Bearer '):
                raise AuthenticationFailed(self.message)
            return True
        except Exception as e:
            print(e)
        

class AllowUnauthenticatedForLoginAndRegister(BasePermission):
    def has_permission(self, request, view):
        return '/login' in request.path or '/register' in request.path