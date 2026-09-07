from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.courses.models import Course
from apps.vocabulary.models import VocabularyCategory, VocabularyEntry

User = get_user_model()


class UserRoleHierarchyTests(TestCase):
    """Pruebas unitarias de las propiedades jerárquicas del modelo User."""

    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@yonna.com",
            password="Password123*",
            role=User.ROLE_ADMIN,
        )
        self.moderator = User.objects.create_user(
            email="moderator@yonna.com",
            password="Password123*",
            role=User.ROLE_MODERATOR,
        )
        self.student = User.objects.create_user(
            email="student@yonna.com",
            password="Password123*",
            role=User.ROLE_USER,
        )
        self.superuser = User.objects.create_superuser(
            email="super@yonna.com",
            password="Password123*",
        )

    def test_admin_properties(self):
        self.assertTrue(self.admin.is_admin)
        self.assertFalse(self.admin.is_moderator)
        self.assertTrue(self.admin.is_moderator_or_admin)
        self.assertFalse(self.admin.is_regular_user)

    def test_moderator_properties(self):
        self.assertFalse(self.moderator.is_admin)
        self.assertTrue(self.moderator.is_moderator)
        self.assertTrue(self.moderator.is_moderator_or_admin)
        self.assertFalse(self.moderator.is_regular_user)

    def test_student_properties(self):
        self.assertFalse(self.student.is_admin)
        self.assertFalse(self.student.is_moderator)
        self.assertFalse(self.student.is_moderator_or_admin)
        self.assertTrue(self.student.is_regular_user)

    def test_superuser_inherits_admin_and_moderator(self):
        self.assertTrue(self.superuser.is_admin)
        self.assertTrue(self.superuser.is_moderator_or_admin)


class UserRoleUpdateSecurityTests(TestCase):
    """Pruebas de seguridad para actualización de roles."""

    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            email="admin1@yonna.com",
            password="Password123*",
            role=User.ROLE_ADMIN,
        )
        self.student = User.objects.create_user(
            email="student1@yonna.com",
            password="Password123*",
            role=User.ROLE_USER,
        )
        self.superuser = User.objects.create_superuser(
            email="super1@yonna.com",
            password="Password123*",
        )

    def test_student_cannot_update_roles(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.patch(
            f"/api/auth/users/{self.student.id}/role/",
            {"role": "admin"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_promote_student_to_moderator(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/auth/users/{self.student.id}/role/",
            {"role": "moderator"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.role, "moderator")

    def test_sole_admin_cannot_self_demote(self):
        """Un admin no puede degradarse a sí mismo si es el único administrador activo."""
        # Remover el rol admin del superuser para este test
        self.superuser.role = User.ROLE_USER
        self.superuser.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/auth/users/{self.admin.id}/role/",
            {"role": "user"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("único administrador", str(response.data))

    def test_admin_cannot_demote_superuser(self):
        """Un admin regular no puede modificar el rol de un superusuario."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/auth/users/{self.superuser.id}/role/",
            {"role": "user"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class VocabularySecurityTests(TestCase):
    """Pruebas de seguridad en el catálogo de vocabulario."""

    def setUp(self):
        self.client = APIClient()
        self.moderator = User.objects.create_user(
            email="moderator_voc@yonna.com",
            password="Password123*",
            role=User.ROLE_MODERATOR,
        )
        self.student = User.objects.create_user(
            email="student_voc@yonna.com",
            password="Password123*",
            role=User.ROLE_USER,
        )
        self.category = VocabularyCategory.objects.create(
            name="Saludos",
            slug="saludos",
        )
        self.entry = VocabularyEntry.objects.create(
            spanish_term="Hola",
            wayuunaiki_translation="Jamaya",
            category=self.category,
        )

    def test_anonymous_can_read_vocabulary(self):
        response = self.client.get("/api/vocabulary/entries/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_cannot_create_vocabulary_entry(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.post(
            "/api/vocabulary/entries/",
            {
                "spanish_term": "Adiós",
                "wayuunaiki_translation": "Anashta",
                "category_id": self.category.id,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_delete_vocabulary_entry(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.delete(f"/api/vocabulary/entries/{self.entry.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_moderator_can_create_vocabulary_entry(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            "/api/vocabulary/entries/",
            {
                "spanish_term": "Gracias",
                "wayuunaiki_translation": "Anayawatsü",
                "category_id": self.category.id,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class CourseObjectPermissionTests(TestCase):
    """Pruebas de permisos por objeto en cursos (IsOwnerOrAdmin)."""

    def setUp(self):
        self.client = APIClient()
        self.mod1 = User.objects.create_user(
            email="mod1@yonna.com",
            password="Password123*",
            role=User.ROLE_MODERATOR,
        )
        self.mod2 = User.objects.create_user(
            email="mod2@yonna.com",
            password="Password123*",
            role=User.ROLE_MODERATOR,
        )
        self.admin = User.objects.create_user(
            email="admin_course@yonna.com",
            password="Password123*",
            role=User.ROLE_ADMIN,
        )
        self.student = User.objects.create_user(
            email="student_course@yonna.com",
            password="Password123*",
            role=User.ROLE_USER,
        )
        self.course_mod1 = Course.objects.create(
            title="Curso Mod 1",
            description="Descripción",
            created_by=self.mod1,
            level_required=1,
        )

    def test_student_cannot_update_course(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.patch(
            f"/api/courses/{self.course_mod1.id}/update/",
            {"title": "Hacked Course"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_mod2_cannot_update_mod1_course(self):
        """Un moderador no puede editar el curso de otro moderador."""
        self.client.force_authenticate(user=self.mod2)
        response = self.client.patch(
            f"/api/courses/{self.course_mod1.id}/update/",
            {"title": "Intento de Modificación"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_mod1_can_update_own_course(self):
        """El creador del curso sí puede editarlo."""
        self.client.force_authenticate(user=self.mod1)
        response = self.client.patch(
            f"/api/courses/{self.course_mod1.id}/update/",
            {"title": "Título Actualizado"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course_mod1.refresh_from_db()
        self.assertEqual(self.course_mod1.title, "Título Actualizado")

    def test_admin_can_update_any_course(self):
        """El administrador puede editar cualquier curso aunque no sea el creador."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/courses/{self.course_mod1.id}/update/",
            {"title": "Editado por Admin"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course_mod1.refresh_from_db()
        self.assertEqual(self.course_mod1.title, "Editado por Admin")
