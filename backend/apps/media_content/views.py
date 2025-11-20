from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from .models import MediaContent, MediaCollection, MediaView
from .serializers import (
    MediaContentSerializer,
    MediaContentCreateSerializer,
    MediaContentUpdateSerializer,
    MediaContentAdminSerializer,
    MediaCollectionSerializer,
    MediaCollectionCreateSerializer,
    MediaViewSerializer,
    MediaStatisticsSerializer,
)
from apps.users.permissions import IsAdmin, IsModerator, IsAdminOrModerator


class MediaContentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar contenido multimedia.
    """
    queryset = MediaContent.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return MediaContentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return MediaContentUpdateSerializer
        elif self.request.user.role in ['admin', 'moderator']:
            return MediaContentAdminSerializer
        return MediaContentSerializer

    def get_queryset(self):
        try:
            queryset = MediaContent.objects.all()
            user = self.request.user

            # Filtros para usuarios no autenticados o regulares
            if not user.is_authenticated or user.role == 'user':
                queryset = queryset.filter(is_approved=True, is_public=True)
            # Moderadores ven su contenido y contenido pendiente de aprobación
            elif user.role == 'moderator':
                queryset = queryset.filter(
                    Q(is_approved=True) | 
                    Q(uploaded_by=user) |
                    Q(is_approved=False)
                )
            # Admins ven todo

            # Filtros opcionales
            media_type = self.request.query_params.get('media_type')
            category = self.request.query_params.get('category')
            featured = self.request.query_params.get('featured')
            search = self.request.query_params.get('search')

            if media_type:
                queryset = queryset.filter(media_type=media_type)
            if category:
                queryset = queryset.filter(category=category)
            if featured:
                queryset = queryset.filter(is_featured=True)
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(description__icontains=search) |
                    Q(tags__icontains=search)
                )

            return queryset.select_related('uploaded_by', 'approved_by').prefetch_related('views')
            
        except Exception as e:
            print(f"Error en get_queryset: {str(e)}")
            return MediaContent.objects.none()

    # --- MEJORA DE AUTO-APROBACIÓN ---
    def perform_create(self, serializer):
        user = self.request.user
        
        # Si el usuario es Admin o Moderador, auto-aprobamos el contenido
        if user.role in ['admin', 'moderator']:
            serializer.save(
                uploaded_by=user,
                is_approved=True,       # ¡Aprobado automático!
                approved_by=user,       # Firmado por ti mismo
                approved_at=timezone.now()
            )
        else:
            # Usuarios normales requieren revisión
            serializer.save(uploaded_by=user, is_approved=False)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrModerator])
    def approve(self, request, pk=None):
        """Aprobar contenido multimedia."""
        media = self.get_object()
        
        if media.is_approved:
            return Response(
                {"detail": "Este contenido ya está aprobado."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        media.is_approved = True
        media.approved_by = request.user
        media.approved_at = timezone.now()
        media.save()
        
        serializer = self.get_serializer(media)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrModerator])
    def feature(self, request, pk=None):
        """Marcar contenido como destacado."""
        media = self.get_object()
        media.is_featured = not media.is_featured
        media.save()
        
        action = "destacado" if media.is_featured else "quitado de destacados"
        return Response({"detail": f"Contenido {action} correctamente."})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def record_view(self, request, pk=None):
        """Registrar una visualización del contenido."""
        media = self.get_object()
        duration_watched = request.data.get('duration_watched', 0)
        
        media_view, created = MediaView.objects.get_or_create(
            media=media,
            user=request.user,
            defaults={'duration_watched': duration_watched}
        )
        
        if not created:
            media_view.duration_watched = max(media_view.duration_watched, duration_watched)
            media_view.save()
        
        return Response({"detail": "Visualización registrada correctamente."})

    @action(detail=False, methods=['get'])
    def my_uploads(self, request):
        """Obtener los contenidos subidos por el usuario actual."""
        queryset = self.get_queryset().filter(uploaded_by=request.user)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrModerator])
    def pending_approval(self, request):
        """Obtener contenidos pendientes de aprobación."""
        queryset = self.get_queryset().filter(is_approved=False)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MediaCollectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar colecciones de contenido multimedia.
    """
    queryset = MediaCollection.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return MediaCollectionCreateSerializer
        return MediaCollectionSerializer

    def get_queryset(self):
        queryset = MediaCollection.objects.all()
        
        if not self.request.user.is_authenticated or self.request.user.role == 'user':
            queryset = queryset.filter(is_public=True)
        
        return queryset.select_related('created_by').prefetch_related('media_files')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def add_media(self, request, pk=None):
        collection = self.get_object()
        media_id = request.data.get('media_id')
        
        if not media_id:
            return Response(
                {"detail": "Se requiere media_id."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            media = MediaContent.objects.get(id=media_id, is_approved=True)
            collection.media_files.add(media)
            return Response({"detail": "Contenido agregado a la colección."})
        except MediaContent.DoesNotExist:
            return Response(
                {"detail": "Contenido no encontrado o no aprobado."},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def remove_media(self, request, pk=None):
        collection = self.get_object()
        media_id = request.data.get('media_id')
        
        if not media_id:
            return Response(
                {"detail": "Se requiere media_id."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            media = MediaContent.objects.get(id=media_id)
            collection.media_files.remove(media)
            return Response({"detail": "Contenido removido de la colección."})
        except MediaContent.DoesNotExist:
            return Response(
                {"detail": "Contenido no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )


class MediaStatisticsViewSet(viewsets.ViewSet):
    """
    ViewSet para estadísticas de contenido multimedia.
    """
    permission_classes = [IsAdminOrModerator]

    def list(self, request):
        total_media = MediaContent.objects.count()
        total_views = MediaView.objects.count()
        
        media_by_type = MediaContent.objects.values('media_type').annotate(
            count=Count('id')
        )
        media_by_type_dict = {item['media_type']: item['count'] for item in media_by_type}
        
        media_by_category = MediaContent.objects.values('category').annotate(
            count=Count('id')
        )
        media_by_category_dict = {item['category']: item['count'] for item in media_by_category}
        
        most_viewed_media = MediaContent.objects.annotate(
            view_count=Count('views')
        ).order_by('-view_count')[:10].values(
            'id', 'title', 'media_type', 'view_count'
        )
        
        recent_uploads = MediaContent.objects.filter(
            uploaded_at__gte=timezone.now() - timedelta(days=7)
        ).values('id', 'title', 'media_type', 'uploaded_at')
        
        data = {
            'total_media': total_media,
            'total_views': total_views,
            'media_by_type': media_by_type_dict,
            'media_by_category': media_by_category_dict,
            'most_viewed_media': list(most_viewed_media),
            'recent_uploads': list(recent_uploads),
        }
        
        serializer = MediaStatisticsSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def user_engagement(self, request):
        active_users = MediaView.objects.values(
            'user__id', 'user__email', 'user__get_full_name'
        ).annotate(
            total_views=Count('id'),
            total_watch_time=Sum('duration_watched')
        ).order_by('-total_views')[:10]
        
        views_by_day = MediaView.objects.filter(
            viewed_at__gte=timezone.now() - timedelta(days=30)
        ).extra({
            'date': "date(viewed_at)"
        }).values('date').annotate(
            views=Count('id')
        ).order_by('date')
        
        return Response({
            'active_users': list(active_users),
            'views_trend': list(views_by_day),
        })